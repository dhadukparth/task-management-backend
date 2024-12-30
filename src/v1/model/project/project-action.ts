import mongoose from 'mongoose';
import { projectModel } from '.';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { ServerError, ServerResponse } from '../../utils/response';

type ProjectType = {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId;
  date: {
    startDate: number;
    endDate: number;
  };
};

class ProjectModelAction {
  /**
   *
   * @param status: passing number indicating  1: not deleted, 2: deleted
   *
   */
  async getAllProjectsAction({ status }: { status: number }): Promise<any> {
    try {
      const projectList = await projectModel.aggregate([
        {
          $match: {
            is_active: true,
            $expr: {
              $cond: {
                if: { $eq: [status, 1] },
                then: {
                  $and: [
                    { $eq: ['$deleted_at.date', null] },
                    { $eq: ['$deleted_at.user_id', null] }
                  ]
                },
                else: {
                  $or: [{ $ne: ['$deleted_at.date', null] }, { $ne: ['$deleted_at.user_id', null] }]
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: MODEL_COLLECTION_LIST.TEAM,
            localField: 'teamId',
            foreignField: '_id',
            as: 'team'
          }
        },
        {
          $lookup: {
            from: MODEL_COLLECTION_LIST.USER,
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner'
          }
        },
        {
          $addFields: {
            created_at: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
              }
            },
            'date.start_date': {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$date.start_date' }
              }
            },
            'date.end_date': {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$date.end_date' }
              }
            },
            team: {
              $let: {
                vars: {
                  activeTeam: {
                    $filter: {
                      input: '$team',
                      as: 'item',
                      cond: { $eq: ['$$item.is_active', true] }
                    }
                  }
                },
                in: { $arrayElemAt: ['$$activeTeam', 0] }
              }
            },
            owner: {
              $let: {
                vars: {
                  activeOwner: {
                    $filter: {
                      input: '$owner',
                      as: 'item',
                      cond: { $eq: ['$$item.is_active', true] }
                    }
                  }
                },
                in: { $arrayElemAt: ['$$activeOwner', 0] }
              }
            }
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      return ServerResponse(STATUS_CODE.CODE_OK, 'Projects fetched successfully.', projectList);
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }

  async getSingleProjects(args: { id: string; name: string }): Promise<any> {
    try {
      const projectList = await projectModel.aggregate([
        {
          $match: {
            $or: [{ _id: args.id }, { name: args.name }],
            is_active: true,
            $and: [{ 'deleted_at.date': null }, { 'deleted_at.user_id': null }]
          }
        },
        {
          $lookup: {
            from: MODEL_COLLECTION_LIST.TEAM,
            localField: 'teamId',
            foreignField: '_id',
            as: 'team'
          }
        },
        {
          $lookup: {
            from: MODEL_COLLECTION_LIST.USER,
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner'
          }
        },
        {
          $addFields: {
            created_at: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
              }
            },
            'date.start_date': {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$date.start_date' }
              }
            },
            'date.end_date': {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$date.end_date' }
              }
            },
            team: {
              $let: {
                vars: {
                  activeTeam: {
                    $filter: {
                      input: '$team',
                      as: 'item',
                      cond: { $eq: ['$$item.is_active', true] }
                    }
                  }
                },
                in: { $arrayElemAt: ['$$activeTeam', 0] }
              }
            },
            owner: {
              $let: {
                vars: {
                  activeOwner: {
                    $filter: {
                      input: '$owner',
                      as: 'item',
                      cond: { $eq: ['$$item.is_active', true] }
                    }
                  }
                },
                in: { $arrayElemAt: ['$$activeOwner', 0] }
              }
            }
          }
        },
        {
          $sort: {
            created_at: -1
          }
        },
        {
          $limit: 1
        }
      ]);

      const result = projectList.length > 0 ? projectList[0] : null;

      if (result) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Projects fetched successfully.', result);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry! This project was not found, Please check its',
        false
      );
    } catch (error: any) {
      console.log('====== error =======>', error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to fetch project list.',
        error
      );
    }
  }

  async createProjectAction(args: ProjectType): Promise<any> {
    try {
      const exitingProjectName = await projectModel.aggregate([
        {
          $match: { name: args.name }
        },
        {
          $limit: 1
        }
      ]);

      if (exitingProjectName.length > 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Project with the same name already exists.',
          false
        );
      }

      const newProject = new projectModel({
        name: args.name,
        description: args.description,
        ownerId: args.owner,
        teamId: args.team,
        date: {
          start_date: args.date.startDate,
          end_date: args.date.endDate
        },
        created_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
      });

      const newProjectResult = await newProject.save();

      if (newProjectResult) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'Project created successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to create new project',
        false
      );
    } catch (error: any) {
      console.log(error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to create project.',
        error
      );
    }
  }

  async updateProjectAction(args: { projectId: string } & ProjectType): Promise<any> {
    try {
      const isExiting = await projectModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(args.projectId),
            is_active: true,
            deleted_at: {
              date: null,
              user_id: null
            }
          }
        }
      ]);

      if (isExiting.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Project is not exiting. Please check it and try again.',
          null
        );
      }

      const isExitingName = await projectModel.aggregate([
        {
          $match: {
            name: args.name,
            is_active: true,
            deleted_at: {
              date: null,
              user_id: null
            }
          }
        }
      ]);

      if (isExitingName.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry! This project is already is exiting.',
          null
        );
      }

      const projectUpdateResult = await projectModel.findOneAndUpdate(
        {
          _id: args.projectId,
          is_active: true,
          deleted_at: {
            date: null,
            user_id: null
          }
        },
        {
          $set: {
            name: args.name,
            description: args.description,
            ownerId: args.owner,
            teamId: args.team,
            date: {
              start_date: args.date.startDate,
              end_date: args.date.endDate
            },
            updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        },
        {
          new: true
        }
      );

      if (projectUpdateResult) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'Project updated successfully.',
          projectUpdateResult
        );
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to update project.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update project.',
        error
      );
    }
  }

  async updateStatusProjectAction(args: { projectId: string; status: boolean }): Promise<any> {
    try {
      const isProjectOperation = await projectModel.aggregate([
        {
          $facet: {
            isExiting: [
              {
                $match: {
                  _id: new mongoose.Types.ObjectId(args.projectId),
                  is_active: true,
                  deleted_at: {
                    date: null,
                    user_id: null
                  }
                }
              }
            ],
            isCheckCurrentStatus: [
              {
                $match: {
                  _id: new mongoose.Types.ObjectId(args.projectId),
                  is_active: !args.status,
                  deleted_at: {
                    date: null,
                    user_id: null
                  }
                }
              }
            ]
          }
        }
      ]);

      const [result] = isProjectOperation;

      if (result.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Project is not exiting. Please check it and try again.',
          null
        );
      }

      const projectUpdateStatusResult = await projectModel.findOneAndUpdate(
        {
          _id: args.projectId
        },
        {
          $set: {
            is_active: args.status,
            updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        },
        {
          new: true
        }
      );

      const statusMsg = args.status ? 'activated' : 'deactivated';

      if (projectUpdateStatusResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, `Project is ${statusMsg} successfully.`, true);
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        `Sorry! This task group is not ${statusMsg}. Please tru again.`,
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update status project.',
        error
      );
    }
  }

  async deleteTempProjectAction(args: { projectId: string; name: string }): Promise<any> {
    try {
      const isExiting = await projectModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(args.projectId),
            name: args.name,
            is_active: false,
            deleted_at: {
              date: null,
              user_id: null
            }
          }
        }
      ]);

      if (isExiting.length > 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Project is not exiting. Please check it and try again.',
          null
        );
      }

      const projectDeleteResult = await projectModel.findOneAndUpdate(
        {
          _id: args.projectId,
          is_active: false
        },
        {
          $set: {
            is_active: false,
            updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
            deleted_at: {
              date: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
              user_id: null
            }
          }
        },
        {
          new: true
        }
      );

      if (projectDeleteResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Project is delete successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Sorry! This project is not deleted. Please tru again.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to delete project.',
        error
      );
    }
  }

  async deletePermanentlyProjectAction(args: { projectId: string; name: string }): Promise<any> {
    try {
      const isExiting = await projectModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(args.projectId),
            name: args.name,
            is_active: false,
            deleted_at: {
              date: null,
              user_id: null
            }
          }
        }
      ]);

      if (isExiting.length > 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Project is not exiting. Please check it and try again.',
          null
        );
      }

      const projectDeleteResult = await projectModel.findOneAndDelete({
        _id: args.projectId,
        is_active: false,
        deleted_at: {
          date: { $exists: true, $ne: null },
          user_id: { $exists: true, $ne: null }
        }
      });

      if (projectDeleteResult) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'Project is permanently delete successfully.',
          true
        );
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Sorry! This project is not permanently deleted. Please tru again.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to delete project.',
        error
      );
    }
  }
}

export default new ProjectModelAction();
