import STATUS_CODE from '../../helper/statusCode';
import { ServerError, ServerResponse } from '../utils/response';
import TaskGroupModelAction from '../model/task-group/task-group-action'

type taskGroupInput = {
  name: string;
  description: string;
  color: string;
};

class TaskGroupController {
  async getAllTaskGroup() {
    const actionResponse = await TaskGroupModelAction.getAllTaskGroupAction();
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  async getSingleTaskGroup(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await TaskGroupModelAction.getSingleTaskGroupAction({
      id,
      name
    });
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  async createTaskGroup(
    _parent: any,
    {
      data
    }: {
      data: taskGroupInput;
    }
  ) {
    const newRecordData = {
      name: data.name,
      description: data.description,
      color: data.color
    };

    const actionResponse = await TaskGroupModelAction.createTaskGroupAction(newRecordData);

    if (actionResponse?.status !== STATUS_CODE.CODE_CREATED) {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    } else {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    }
  }

  async updateTaskGroup(_parent: any, { id, data }: { id: string; data: taskGroupInput }) {
    const updateRecordData = {
      id: id,
      name: data.name,
      description: data.description,
      color: data.color
    };
    const actionResponse = await TaskGroupModelAction.updateTaskGroupAction(updateRecordData);
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  async updateStatusTaskGroup(_parent: any, { id, status }: { id: string; status: boolean }) {
    const actionResponse = await TaskGroupModelAction.updateStatusTaskGroupAction({
      id,
      status
    });

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  async deleteTaskGroup(_parent: any, { ids }: { ids: string[] }) {
    const actionResponse = await TaskGroupModelAction.deleteTaskGroupAction({
      ids
    });
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }
}

export const taskGroupController = new TaskGroupController();
