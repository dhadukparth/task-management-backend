import TaskGroupModelAction from '../model/task-group/task-group-action';
import { ServerResponse } from '../utils/response';

type taskGroupInput = {
  projectId: string;
  name: string;
  description: string;
  color: string;
};

class TaskGroupController {
  async getAllTaskGroup(_parent: any, { type }: any) {
    const actionResponse = await TaskGroupModelAction.getAllTaskGroupAction({
      type: type
    });
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  async getSingleTaskGroup(_parent: any, { projectId }: { projectId: string }) {
    const actionResponse = await TaskGroupModelAction.getSingleTaskGroupAction({
      projectId
    });
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * Group action function here
   *
   */

  async createTaskGroup(
    _parent: any,
    {
      data
    }: {
      data: taskGroupInput;
    }
  ) {
    const newRecordData = {
      projectId: data.projectId,
      groupData: {
        name: data.name,
        description: data.description,
        color: data.color
      }
    };

    const actionResponse = await TaskGroupModelAction.createTaskGroupAction(newRecordData);

    return actionResponse;
  }

  async updateTaskGroup(_parent: any, { id, data }: { id: string; data: taskGroupInput }) {
    const updateRecordData = {
      projectId: data.projectId,
      groupData: {
        groupId: id,
        name: data.name,
        description: data.description,
        color: data.color
      }
    };
    const actionResponse = await TaskGroupModelAction.updateTaskGroupAction(updateRecordData);
    return actionResponse;
  }

  async updateStatusTaskGroup(_parent: any, { id, projectId }: { id: string; projectId: string }) {
    const actionResponse = await TaskGroupModelAction.updateStatusTaskGroupAction({
      groupId: id,
      projectId
    });

    return actionResponse;
  }

  async deletePermanentlyTaskGroup(
    _parent: any,
    { projectId, ids }: { projectId: string; ids: string[] }
  ) {
    const actionResponse = await TaskGroupModelAction.deleteTaskGroupAction({
      projectId,
      groupIds: ids
    });
    return actionResponse;
  }

  /**
   *
   * Label action function here
   *
   */

  async createTaskLabel(
    _parent: any,
    {
      data
    }: {
      data: taskGroupInput;
    }
  ) {
    const newRecordData = {
      projectId: data.projectId,
      labelData: {
        name: data.name,
        description: data.description,
        color: data.color
      }
    };

    const actionResponse = await TaskGroupModelAction.createTaskLabelAction(newRecordData);

    return actionResponse;
  }

  async updateTaskLabel(_parent: any, { id, data }: { id: string; data: taskGroupInput }) {
    const updateRecordData = {
      projectId: data.projectId,
      labelData: {
        labelId: id,
        name: data.name,
        description: data.description,
        color: data.color
      }
    };
    const actionResponse = await TaskGroupModelAction.updateTaskLabelAction(updateRecordData);
    return actionResponse;
  }

  async updateStatusTaskLabel(_parent: any, { id, projectId }: { id: string; projectId: string }) {
    const actionResponse = await TaskGroupModelAction.updateStatusTaskLabelAction({
      projectId,
      labelId: id
    });

    return actionResponse;
  }

  async deletePermanentlyTaskLabel(
    _parent: any,
    { projectId, ids }: { projectId: string; ids: string[] }
  ) {
    const actionResponse = await TaskGroupModelAction.deleteTaskLabelAction({
      projectId,
      labelIds: ids
    });
    return actionResponse;
  }
}

export const taskGroupController = new TaskGroupController();
