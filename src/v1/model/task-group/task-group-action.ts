import mongoose from 'mongoose';
import { taskGroupModel } from '.';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { ServerError, ServerResponse } from '../../utils/response';

class TaskGroupModelAction {
  async getAllTaskGroupAction(): Promise<any> {
    try {
      const taskGroupList = await taskGroupModel.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            color: 1,
            is_active: 1,
            created_at: 1,
            updated_at: 1
          }
        },
        {
          $sort: {
            created_at: -1
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

  async getSingleTaskGroupAction({ id, name }: { id: string; name: string }): Promise<any> {
    try {
      const taskGroupId = new mongoose.Types.ObjectId(id);

      const resultAction = await taskGroupModel.aggregate([
        {
          $match: {
            $or: [{ _id: taskGroupId }, { name }]
          }
        }
      ]);

      if (resultAction?.length > 0) {
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
      console.log(error);
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to fetch task group.',
        error
      );
    }
  }

  async createTaskGroupAction({
    name,
    description,
    color
  }: {
    name: string;
    description: string;
    color: string;
  }): Promise<any> {
    try {
      const existingTaskGroup = await taskGroupModel.aggregate([
        { $match: { name } },
        { $limit: 1 }
      ]);

      if (existingTaskGroup.length > 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task group with the same name already exists.',
          null
        );
      }

      const newTaskGroup = new taskGroupModel({
        name,
        description,
        color
      });

      const newTaskGroupResult = await newTaskGroup.save();

      if (newTaskGroupResult) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'Task group created successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to create task group.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to create task group.',
        error
      );
    }
  }

  async updateTaskGroupAction({
    id,
    name,
    description,
    color
  }: {
    id: string;
    name: string;
    description: string;
    color: string;
  }): Promise<any> {
    try {
      const isExiting = await taskGroupModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        }
      ]);

      if (isExiting.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task group is not exiting. Please check it and try again.',
          null
        );
      }

      const taskGroupUpdateResult = await taskGroupModel.findOneAndUpdate(
        {
          _id: id
        },
        {
          $set: {
            name,
            description,
            color,
            updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      if (!taskGroupUpdateResult) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! Task group is not updated. Please try again.',
          null
        );
      }

      return ServerResponse(STATUS_CODE.CODE_OK, 'Task group updated successfully.', true);
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update task group.',
        error
      );
    }
  }

  async updateStatusTaskGroupAction({ id, status }: { id: string; status: boolean }): Promise<any> {
    try {
      const isExiting = await taskGroupModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            is_active: !status
          }
        }
      ]);

      if (isExiting.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task group is not exiting. Please check it and try again.',
          null
        );
      }

      const isUpdatingResult = await taskGroupModel.findOneAndUpdate(
        {
          _id: id,
          is_active: !status
        },
        {
          $set: {
            is_active: status,
            updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      const statusMsg = status ? 'activated' : 'deactivated';

      if (!isUpdatingResult) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          `Sorry! This task group is not ${statusMsg}. Please tru again.`,
          null
        );
      }

      return ServerResponse(
        STATUS_CODE.CODE_OK,
        `Task group status ${statusMsg} successfully.`,
        true
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update status task group.',
        error
      );
    }
  }

  async deleteTaskGroupAction({ ids }: { ids: string[] }): Promise<any> {
    try {
      const isExiting = await taskGroupModel.aggregate([
        {
          $match: {
            _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }
          }
        }
      ]);

      if (isExiting.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task group is not exiting. Please check it and try again.',
          null
        );
      }

      const isDeletingResult = await taskGroupModel.deleteMany({
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }
      });

      if (isDeletingResult.deletedCount === 0) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! No task group were deleted. Please check the provided task group and try again.',
          null
        );
      }

      return ServerResponse(STATUS_CODE.CODE_OK, 'Task group deleted successfully', true);
    } catch (error: any) {
      console.log(error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to deleted task group.',
        error
      );
    }
  }
}

export default new TaskGroupModelAction();
