import mongoose from 'mongoose';
import { taskListModel } from '.';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { taskListPipelines } from '../../Pipelines';
import { ServerError, ServerResponse } from '../../utils/response';

class TaskModelAction {
  // TODO: All the data fetch operations here

  async getAllTaskListAction(args: { status: number }) {
    try {
      const taskList = await taskListModel.aggregate([
        ...taskListPipelines.taskList_pipeline,
        {
          $match: {
            $expr: {
              $cond: {
                if: { $eq: [args.status, 1] },
                then: {
                  $and: [
                    { $ne: ['$deleted_at.date', null] }
                    // {
                    //   $ne: ["$deleted_at.user_id", null]
                    // }
                  ]
                },
                else: {
                  $and: [
                    { $eq: ['$deleted_at.date', null] }
                    // {
                    //   $eq: ["$deleted_at.user_id", null]
                    // }
                  ]
                }
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

      return ServerResponse(STATUS_CODE.CODE_OK, 'All task list fetched successfully', taskList);
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async getSingleTaskListAction(args: { projectId: string; taskId: string }) {
    try {
      const taskList = await taskListModel.aggregate([
        ...taskListPipelines.taskList_pipeline,
        {
          $match: {
            _id: new mongoose.Types.ObjectId(args.taskId),
            'project._id': new mongoose.Types.ObjectId(args.projectId)
          }
        },
        {
          $limit: 1
        }
      ]);

      if (taskList.length) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'Single task list fetched successfully',
          taskList[0]
        );
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry! Task not found', null, false);
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  // TODO: all action related methods here
  async createNewTaskAction(args: {
    name: string;
    description: string;
    projectId: string;
    labelId: string[];
    groupId: string;
    userId: string;
    date: {
      start_date: number;
      end_date: number;
    };
  }) {
    try {
      const isExisting = await taskListModel.aggregate([
        {
          $match: {
            project_id: new mongoose.Types.ObjectId(args.projectId),
            'task_list.name': args.name
          }
        }
      ]);

      if (isExisting?.length !== 0) {
        return ServerError(STATUS_CODE.CODE_CONFLICT, 'Task already exists', null, false);
      }

      // Add the new task to the task_list array of the corresponding project
      const result = await taskListModel.findOneAndUpdate(
        { project_id: new mongoose.Types.ObjectId(args.projectId) },
        {
          $push: {
            task_list: {
              name: args.name,
              description: args.description,
              label_id: args.labelId,
              group_id: args.groupId,
              user_assign: args.userId,
              date: args.date,
              is_active: true,
              created_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
              updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
            }
          }
        },
        { new: true, upsert: true } // Creates a new project entry if it doesn't exist
      );

      if (result) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'Task created successfully', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'Failed to create new task',
          null,
          false
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updateTaskAction(args: {
    name: string;
    taskId: string;
    projectId: string;
    description: string;
    labelIds: string[];
    groupId: string;
    userId: string;
    date: {
      start_date: number;
      end_date: number;
    };
  }) {
    try {
      const isExisting = await taskListModel.findOne({
        project_id: new mongoose.Types.ObjectId(args.projectId),
        'task_list._id': new mongoose.Types.ObjectId(args.taskId),
        'task_list.deleted_at.date': { $ne: null }
      });

      if (!isExisting) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry!, This task not found please check task and project.',
          null,
          false
        );
      }

      // Update the task inside task_list array
      const taskGroupUpdateResult = await taskListModel.findOneAndUpdate(
        {
          project_id: new mongoose.Types.ObjectId(args.projectId),
          'task_list._id': new mongoose.Types.ObjectId(args.taskId)
        },
        {
          $set: {
            'task_list.$.name': args.name,
            'task_list.$.description': args.description,
            'task_list.$.label_id': args.labelIds,
            'task_list.$.group_id': new mongoose.Types.ObjectId(args.groupId),
            'task_list.$.user_assign': new mongoose.Types.ObjectId(args.userId),
            'task_list.$.date.start_date': args.date.start_date,
            'task_list.$.date.end_date': args.date.end_date,
            'task_list.$.updated_at': DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (taskGroupUpdateResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Task updated successfully.', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! Task was not updated. Please try again.',
          null
        );
      }
    } catch (error: any) {
      console.error('Update Task Error:', error);
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updateStatusTaskAction(args: { taskId: string; projectId: string }) {
    try {
      const isExisting = await taskListModel.aggregate([
        {
          $match: {
            project_id: new mongoose.Types.ObjectId(args.projectId),
            'task_list._id': new mongoose.Types.ObjectId(args.taskId)
          }
        },
        { $unwind: '$task_list' },
        {
          $match: {
            'task_list._id': new mongoose.Types.ObjectId(args.taskId),
            'task_list.deleted_at.date': { $eq: null }
            // "task_list.deleted_at.user_id": {$ne: null}
          }
        },
        { $limit: 1 }
      ]);

      if (!isExisting?.length) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry!, This task not found please check task and project.',
          null,
          false
        );
      }

      const changeStatus = !isExisting?.[0]?.task_list?.is_active;
      const statusMsg = changeStatus ? 'activated' : 'deactivated';

      const taskGroupUpdateResult = await taskListModel.findOneAndUpdate(
        {
          project_id: new mongoose.Types.ObjectId(args.projectId),
          'task_list._id': new mongoose.Types.ObjectId(args.taskId)
        },
        {
          $set: {
            'task_list.$.is_active': changeStatus,
            'task_list.$.updated_at': DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      if (taskGroupUpdateResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, `Task ${statusMsg} successfully.`, true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          `Sorry! Task is not ${statusMsg}. Please try again.`,
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async deleteTempTaskAction(args: { projectId: string; taskId: string }) {
    try {
      const isExisting = await taskListModel.aggregate([
        {
          $match: {
            project_id: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        { $unwind: '$task_list' },
        {
          $match: {
            'task_list.is_active': false,
            'task_list._id': new mongoose.Types.ObjectId(args.taskId),
            'task_list.deleted_at.date': { $eq: null }
            // "task_list.deleted_at.user_id": {$ne: null}
          }
        },
        { $limit: 1 }
      ]);

      if (!isExisting?.length) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry! This task is not found, Please try again.',
          null,
          false
        );
      }

      const deleteResult = await taskListModel.findOneAndUpdate(
        {
          project_id: new mongoose.Types.ObjectId(args.projectId),
          'task_list._id': new mongoose.Types.ObjectId(args.taskId)
        },
        {
          $set: {
            'task_list.$.is_active': false,
            'task_list.$.deleted_at.date': DateTimeUtils.convertToUTC(
              DateTimeUtils.getToday(),
              'UTC'
            ),
            'task_list.$.deleted_at.user': null
          }
        }
      );

      if (deleteResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, `Task delete successfully.`, true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          `Sorry! Task is not deleted. Please try again.`,
          null
        );
      }
    } catch (error: any) {
      console.error('Error in deleteTempTask:', error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.message || 'Internal server error',
        error
      );
    }
  }

  async restoreTaskAction(args: { projectId: string; taskId: string }) {
    try {
      const isExisting = await taskListModel.aggregate([
        {
          $match: {
            project_id: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        { $unwind: '$task_list' },
        {
          $match: {
            'task_list.is_active': false,
            'task_list._id': new mongoose.Types.ObjectId(args.taskId),
            'task_list.deleted_at.date': { $ne: null }
            // "task_list.deleted_at.user_id": {$ne: null}
          }
        },
        { $limit: 1 }
      ]);

      if (!isExisting?.length) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry! This task is not found, Please try again.',
          null,
          false
        );
      }

      const restoreResult = await taskListModel.findOneAndUpdate(
        {
          project_id: new mongoose.Types.ObjectId(args.projectId),
          'task_list._id': new mongoose.Types.ObjectId(args.taskId)
        },
        {
          $set: {
            'task_list.$.is_active': true,
            'task_list.$.deleted_at.date': null,
            'task_list.$.deleted_at.user': null
          }
        }
      );

      if (restoreResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, `Task restore successfully.`, true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          `Sorry! Task is not restored. Please try again.`,
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async deletePermanentlyTaskAction(args: { projectId: string; taskId: string }) {
    try {
      const isExisting = await taskListModel.aggregate([
        {
          $match: {
            project_id: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        { $unwind: '$task_list' },
        {
          $match: {
            'task_list.is_active': false,
            'task_list._id': new mongoose.Types.ObjectId(args.taskId),
            'task_list.deleted_at.date': { $ne: null }
            // "task_list.deleted_at.user_id": {$ne: null}
          }
        },
        { $limit: 1 }
      ]);

      if (!isExisting?.length) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry! This task is not found, Please try again.',
          null,
          false
        );
      }

      const deleteResult = await taskListModel.updateOne(
        {
          project_id: new mongoose.Types.ObjectId(args.projectId)
        },
        {
          $pull: {
            task_list: {
              _id: new mongoose.Types.ObjectId(args.taskId)
            }
          }
        }
      );

      if (deleteResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, `Task delete permanently successfully.`, true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          `Sorry! Task is not deleted permanently. Please try again.`,
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }
}

export default new TaskModelAction();
