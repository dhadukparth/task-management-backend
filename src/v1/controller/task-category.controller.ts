import STATUS_CODE from '../../helper/statusCode';
import TaskCategoryModelAction from '../model/task-category/task-category-action';
import { ServerError, ServerResponse } from '../utils/response';

type taskCategoryInput = {
  name: string;
  description: string;
};

class TaskCategoryController {
  async getAllTaskCategory() {
    const actionResponse = await TaskCategoryModelAction.getAllTaskCategoryAction();
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  async getSingleTaskCategory(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await TaskCategoryModelAction.getSingleTaskCategoryAction({
      id,
      name
    });
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  async createTaskCategory(
    _parent: any,
    {
      data
    }: {
      data: taskCategoryInput;
    }
  ) {
    const newRecordData = {
      name: data.name,
      description: data.description
    };

    console.log(data)

    const actionResponse = await TaskCategoryModelAction.createTaskCategoryAction(newRecordData);

    if (actionResponse?.status !== STATUS_CODE.CODE_CREATED) {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    } else {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    }
  }

  async updateTaskCategory(_parent: any, { id, data }: { id: string; data: taskCategoryInput }) {
    const updateRecordData = {
      id: id,
      name: data.name,
      description: data.description
    };
    const actionResponse = await TaskCategoryModelAction.updateTaskCategoryAction(updateRecordData);
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  async updateStatusTaskCategory(_parent: any, { id, status }: { id: string; status: boolean }) {
    const actionResponse = await TaskCategoryModelAction.updateStatusTaskCategoryAction({
      id,
      status
    });

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  async deleteTaskCategory(_parent: any, { ids }: { ids: string[] }) {
    const actionResponse = await TaskCategoryModelAction.deleteTaskCategoryAction({
      ids
    });
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }
}

export const taskCategoryController = new TaskCategoryController();
