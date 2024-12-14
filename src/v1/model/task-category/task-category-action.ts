import mongoose from 'mongoose';
import { taskCategoryModel } from '.';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { ServerError, ServerResponse } from '../../utils/response';

class TaskCategoryModelAction {
  async getAllTaskCategoryAction(): Promise<any> {
    try {
      const taskCategories = await taskCategoryModel.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
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

      return ServerResponse(
        STATUS_CODE.CODE_OK,
        'Task categories fetched successfully.',
        taskCategories
      );
    } catch (error) {
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to fetch task categories.',
        error
      );
    }
  }

  async getSingleTaskCategoryAction({ id, name }: { id: string; name: string }): Promise<any> {
    try {
      const taskId = new mongoose.Types.ObjectId(id);

      const taskCategories = await taskCategoryModel.aggregate([
        {
          $match: {
            $or: [{ _id: taskId }, { name }]
          }
        }
      ]);

      if (taskCategories?.length > 0) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'Task categories fetched successfully.',
          taskCategories[0]
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry! This task category does not exist. Please check it.',
        false
      );
    } catch (error: any) {
      console.log(error);
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to fetch task category.',
        error
      );
    }
  }

  async createTaskCategoryAction({
    name,
    description
  }: {
    name: string;
    description: string;
  }): Promise<any> {
    try {
      const existingTaskCategories = await taskCategoryModel.aggregate([
        { $match: { name } },
        { $limit: 1 }
      ]);

      if (existingTaskCategories.length > 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task category with the same name already exists.',
          null
        );
      }

      const newTaskCategory = new taskCategoryModel({
        name,
        description
      });

      const newTaskCategoryResult = await newTaskCategory.save();

      if (newTaskCategoryResult) {
        return ServerResponse(
          STATUS_CODE.CODE_CREATED,
          'Task category created successfully.',
          true
        );
      }

      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Failed to create task category.',
        false
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to create task category.',
        error
      );
    }
  }

  async updateTaskCategoryAction({
    id,
    name,
    description
  }: {
    id: string;
    name: string;
    description: string;
  }): Promise<any> {
    try {
      const isExiting = await taskCategoryModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        }
      ]);

      if (isExiting.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task category(s) are associated with tasks. Please remove the tasks first.',
          null
        );
      }

      const taskCategoryUpdateResult = await taskCategoryModel.findOneAndUpdate(
        {
          _id: id
        },
        {
          $set: {
            name,
            description,
            updated_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        }
      );

      if (!taskCategoryUpdateResult) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! Task category is not updated. Please try again.',
          null
        );
      }

      return ServerResponse(STATUS_CODE.CODE_OK, 'Task category updated successfully.', true);
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update task category.',
        error
      );
    }
  }

  async updateStatusTaskCategoryAction({
    id,
    status
  }: {
    id: string;
    status: boolean;
  }): Promise<any> {
    try {
      const isExiting = await taskCategoryModel.aggregate([
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
          'Task category(s) are associated with tasks. Please remove the tasks first.',
          null
        );
      }

      const isUpdatingResult = await taskCategoryModel.findOneAndUpdate(
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

      if (!isUpdatingResult) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Task category not found.', null);
      }

      return ServerResponse(
        STATUS_CODE.CODE_OK,
        `Task category status ${status ? 'activated' : 'deactivated'} successfully.`,
        true
      );
    } catch (error: any) {
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to update status task category.',
        error
      );
    }
  }

  async deleteTaskCategoryAction({ ids }: { ids: string[] }): Promise<any> {
    try {
      const isExiting = await taskCategoryModel.aggregate([
        {
          $match: {
            _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }
          }
        }
      ]);

      if (isExiting.length === 0) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Task category(s) are associated with tasks. Please remove the tasks first.',
          null
        );
      }

      const isDeletingResult = await taskCategoryModel.deleteMany({
        _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }
      });

      if (isDeletingResult.deletedCount === 0) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! No task categories were deleted. Please check the provided IDs and try again.',
          null
        );
      }

      return ServerResponse(STATUS_CODE.CODE_OK, 'Task category deleted successfully', true);
    } catch (error: any) {
      console.log(error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'Failed to deleted task category.',
        error
      );
    }
  }
}

export default new TaskCategoryModelAction();
