import mongoose from 'mongoose';
import { taskGroupModel } from '.';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { taskGroupPipelines } from '../../Pipelines';
import { ServerError, ServerResponse } from '../../utils/response';

type taskGroupTypeEnum = 'GROUP' | 'LABEL';

class TaskGroupModelAction {
  async getAllTaskGroupAction(args: { type: taskGroupTypeEnum }): Promise<any> {
    try {
      const taskGroupList = await taskGroupModel.aggregate([
        ...taskGroupPipelines.taskGroup_pipeline,
        {
          $project: {
            project: 1,
            group: {
              $cond: {
                if: { $eq: [args.type, 'GROUP'] },
                then: '$group',
                else: '$$REMOVE'
              }
            },
            labels: {
              $cond: {
                if: { $eq: [args.type, 'LABEL'] },
                then: '$labels',
                else: '$$REMOVE'
              }
            }
          }
        }
      ]);

      return ServerResponse(STATUS_CODE.CODE_OK, 'Task group fetched successfully.', taskGroupList);
    } catch (error) {
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to fetch task group.',
        error
      );
    }
  }

  async getSingleTaskGroupAction(args: { projectId: string }): Promise<any> {
    try {
      const resultAction = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        ...taskGroupPipelines.taskGroup_pipeline
      ]);

      if (resultAction?.length !== 0) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'Task group fetched successfully.',
          resultAction[0]
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry! This task group does not exist. Please check it.',
        false
      );
    } catch (error: any) {
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to fetch task group.',
        error
      );
    }
  }

  // TODO: Group related all methods here

  /**
   * Creates a new group within a task group.
   * @param projectId - The ID of the project to which the group belongs.
   * @param groupData - The group data to be created.
   * @returns True if the group is created successfully, otherwise throws an error.
   */
  async createTaskGroupAction(args: {
    projectId: string;
    groupData: {
      name: string;
      description: string;
      color: string;
    };
  }): Promise<any> {
    try {
      const isExitingGroup = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId),
            'group.name': args.groupData.name
          }
        }
      ]);

      if (isExitingGroup && isExitingGroup?.length !== 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'A group with the same name already exists.',
          false
        );
      }

      const updatedTaskGroup = await taskGroupModel.findOneAndUpdate(
        { projectId: new mongoose.Types.ObjectId(args.projectId) },
        {
          $push: {
            group: {
              ...args.groupData,
              is_active: true,
              created_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
              updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
            }
          }
        },
        { new: true, upsert: true }
      );

      if (updatedTaskGroup) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'Task group is create successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to create task group.',
        false
      );
    } catch (error: any) {
      console.error('Error creating group:', error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to create task group.',
        error
      );
    }
  }

  /**
   * Updates an existing group by ObjectId within a task group.
   * @param projectId - The ID of the project.
   * @param id - The ID of the group to be updated.
   * @param groupData - The group data to update.
   * @returns True if the group is updated successfully, otherwise throws an error.
   */
  async updateTaskGroupAction(args: {
    projectId: string;
    groupData: {
      groupId: string;
      name: string;
      description: string;
      color: string;
    };
  }): Promise<any> {
    try {
      const isExitingGroup = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId),
            'group._id': args.groupData.groupId
          }
        }
      ]);

      if (isExitingGroup && isExitingGroup?.length !== 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task group is not exiting. Please check it and try again.',
          null
        );
      }

      const taskGroupUpdateResult = await taskGroupModel.findOneAndUpdate(
        {
          projectId: new mongoose.Types.ObjectId(args.projectId),
          'group._id': new mongoose.Types.ObjectId(args.groupData.groupId)
        },
        {
          $set: {
            'group.$.name': args.groupData.name,
            'group.$.description': args.groupData.description,
            'group.$.color': args.groupData.color,
            'group.$.updated_at': DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      if (taskGroupUpdateResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Task group updated successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry! Task group is not updated. Please try again.',
        null
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update task group.',
        error
      );
    }
  }

  /**
   * Updates an existing group by ObjectId within a task group.
   * @param projectId - The ID of the project.
   * @param groupId - The ID of the label to be updated.
   * @returns True if the label is updated successfully, otherwise throws an error.
   */
  async updateStatusTaskGroupAction(args: { projectId: string; groupId: string }): Promise<any> {
    try {
      const isExitingGroup: any = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        {
          $unwind: '$group'
        },
        {
          $match: {
            'group._id': new mongoose.Types.ObjectId(args.groupId)
          }
        }
      ]);

      if (isExitingGroup?.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task group is not exiting. Please check it and try again.',
          null
        );
      }

      const changeStatus = !isExitingGroup?.[0]?.group?.is_active;
      const statusMsg = changeStatus ? 'activated' : 'deactivated';

      const taskGroupUpdateResult = await taskGroupModel.findOneAndUpdate(
        {
          projectId: new mongoose.Types.ObjectId(args.projectId),
          'group._id': new mongoose.Types.ObjectId(args.groupId)
        },
        {
          $set: {
            'group.$.is_active': changeStatus,
            'group.$.updated_at': DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      if (taskGroupUpdateResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, `Task group ${statusMsg} successfully.`, true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        `Sorry! Task group is not ${statusMsg}. Please try again.`,
        null
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update task group.',
        error
      );
    }
  }

  async deleteTaskGroupAction(args: { projectId: string; groupIds: string[] }): Promise<any> {
    try {
      const isExitingGroup = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        {
          $unwind: '$group'
        },
        {
          $match: {
            'group._id': { $in: args.groupIds.map((id) => new mongoose.Types.ObjectId(id)) }
          }
        },
        {
          $group: {
            _id: null,
            matchedGroupIds: { $addToSet: '$group._id' }
          }
        }
      ]);

      if (isExitingGroup?.length === 0) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'No matching groups found', null);
      }

      // Extract matched group IDs from the aggregation result
      const matchedGroupIds = isExitingGroup[0]?.matchedGroupIds || [];

      // Check if all provided groupIds exist in the matchedGroupIds
      const allGroupIdsExist = args.groupIds.every((id) =>
        matchedGroupIds.some((matchedId: any) => matchedId?.equals(new mongoose.Types.ObjectId(id)))
      );

      if (!allGroupIdsExist) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Some groups were not found in the project.',
          null
        );
      }

      // Remove the matched labels from the document
      const isUpdatingResult = await taskGroupModel.updateOne(
        { projectId: new mongoose.Types.ObjectId(args.projectId) },
        {
          $pull: {
            group: { _id: { $in: matchedGroupIds } }
          }
        }
      );

      if (isUpdatingResult.modifiedCount === 0) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! No task group were deleted. Please check the provided task group and try again.',
          null
        );
      }

      return ServerResponse(STATUS_CODE.CODE_OK, 'Task group deleted successfully', true);
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to deleted task group.',
        error
      );
    }
  }

  // TODO: Labels related all methods here

  /**
   * Creates a new label within a task group.
   * @param projectId - The ID of the project to which the label belongs.
   * @param labelData - The label data to be created.
   * @returns True if the label is created successfully, otherwise throws an error.
   */
  async createTaskLabelAction(args: {
    projectId: string;
    labelData: {
      name: string;
      description: string;
      color: string;
    };
  }): Promise<any> {
    try {
      const isExitingLabel = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId),
            'labels.name': args.labelData.name
          }
        }
      ]);

      if (isExitingLabel && isExitingLabel?.length !== 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'A label with the same name already exists.',
          false
        );
      }

      const updatedTaskGroup = await taskGroupModel.findOneAndUpdate(
        { projectId: new mongoose.Types.ObjectId(args.projectId) },
        {
          $push: {
            labels: {
              ...args.labelData,
              is_active: true,
              created_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
              updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
            }
          }
        },
        { new: true, upsert: true }
      );

      if (updatedTaskGroup) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'Task label is create successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to create task label.',
        false
      );
    } catch (error) {
      console.error('Error creating label:', error);
      throw new Error('Failed to create label');
    }
  }

  /**
   * Updates an existing group by ObjectId within a task group.
   * @param projectId - The ID of the project.
   * @param id - The ID of the label to be updated.
   * @param labelData - The label data to update.
   * @returns True if the label is updated successfully, otherwise throws an error.
   */
  async updateTaskLabelAction(args: {
    projectId: string;
    labelData: {
      labelId: string;
      name: string;
      description: string;
      color: string;
    };
  }): Promise<any> {
    try {
      const isExitingLabel = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId),
            'labels._id': args.labelData.labelId
          }
        }
      ]);

      if (isExitingLabel && isExitingLabel?.length !== 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task label is not exiting. Please check it and try again.',
          null
        );
      }

      const taskLabelUpdateResult = await taskGroupModel.findOneAndUpdate(
        {
          projectId: new mongoose.Types.ObjectId(args.projectId),
          'labels._id': new mongoose.Types.ObjectId(args.labelData.labelId)
        },
        {
          $set: {
            'labels.$.name': args.labelData.name,
            'labels.$.description': args.labelData.description,
            'labels.$.color': args.labelData.color,
            'labels.$.updated_at': DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      if (taskLabelUpdateResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Task label updated successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry! Task label is not updated. Please try again.',
        null
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update task label.',
        error
      );
    }
  }

  /**
   * Updates an existing group by ObjectId within a task group.
   * @param projectId - The ID of the project.
   * @param groupId - The ID of the label to be updated.
   * @returns True if the label is updated successfully, otherwise throws an error.
   */
  async updateStatusTaskLabelAction(args: { projectId: string; labelId: string }): Promise<any> {
    try {
      const isExitingLabel: any = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        {
          $unwind: '$labels'
        },
        {
          $match: {
            'labels._id': new mongoose.Types.ObjectId(args.labelId)
          }
        }
      ]);

      if (isExitingLabel?.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task label is not exiting. Please check it and try again.',
          null
        );
      }

      const changeStatus = !isExitingLabel?.[0]?.labels?.is_active;
      const statusMsg = changeStatus ? 'activated' : 'deactivated';

      const taskLabelUpdateResult = await taskGroupModel.findOneAndUpdate(
        {
          projectId: new mongoose.Types.ObjectId(args.projectId),
          'labels._id': new mongoose.Types.ObjectId(args.labelId)
        },
        {
          $set: {
            'labels.$.is_active': changeStatus,
            'labels.$.updated_at': DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      if (taskLabelUpdateResult) {
        return ServerResponse(STATUS_CODE.CODE_OK, `Task label ${statusMsg} successfully.`, true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        `Sorry! Task label is not ${statusMsg}. Please try again.`,
        null
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update task label.',
        error
      );
    }
  }

  /**
   * Deletes specific labels from a task group.
   * Ensures only the matching labels are removed, not the entire document.
   * @param args - Contains projectId and labelIds to be removed.
   * @returns Server response indicating success or failure.
   */
  async deleteTaskLabelAction(args: { projectId: string; labelIds: string[] }): Promise<any> {
    try {
      const isExitingLabel = await taskGroupModel.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(args.projectId)
          }
        },
        {
          $unwind: '$labels'
        },
        {
          $match: {
            'labels._id': { $in: args.labelIds.map((id) => new mongoose.Types.ObjectId(id)) }
          }
        },
        {
          $group: {
            _id: null,
            matchedLabelIds: { $addToSet: '$labels._id' }
          }
        }
      ]);

      if (isExitingLabel?.length === 0) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'No matching labels found', null);
      }

      // Extract matched label IDs from the aggregation result
      const matchedLabelIds = isExitingLabel[0]?.matchedLabelIds || [];

      // Check if all provided labelIds exist in the matchedLabelIds
      const allLabelIdsExist = args.labelIds.every((id) =>
        matchedLabelIds.some((matchedId: any) => matchedId?.equals(new mongoose.Types.ObjectId(id)))
      );

      if (!allLabelIdsExist) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Some labels were not found in the project.',
          null
        );
      }

      // Remove the matched labels from the document
      const isUpdatingResult = await taskGroupModel.updateOne(
        { projectId: new mongoose.Types.ObjectId(args.projectId) },
        {
          $pull: {
            labels: { _id: { $in: matchedLabelIds } }
          }
        }
      );

      if (isUpdatingResult.modifiedCount === 0) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! No task labels were deleted. Please check the provided task labels and try again.',
          null
        );
      }

      return ServerResponse(STATUS_CODE.CODE_OK, 'Task labels deleted successfully', true);
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to delete task labels.',
        error
      );
    }
  }
}

export default new TaskGroupModelAction();
