import DateTimeUtils from '../../helper/moment';
import TaskModelAction from '../model/task/task-action';

type taskInput = {
  projectId: string;
  name: string;
  assignUserId: string;
  description: string;
  labelId: string[];
  groupId: string;
  startDate: string;
  endDate: string;
};

class TaskListController {
  async getAllTaskList(_parent: any, { type }: { type: 'NOT_DELETED' | 'DELETED' }) {
    const actionResponse = await TaskModelAction.getAllTaskListAction({
      status: type === 'DELETED' ? 1 : 0
    });
    return actionResponse;
  }

  async getSingleTaskList(
    _parent: any,
    { projectId, taskId }: { projectId: string; taskId: string }
  ) {
    const actionResponse = await TaskModelAction.getSingleTaskListAction({
      projectId: projectId,
      taskId: taskId
    });
    return actionResponse;
  }

  /**
   *
   * Group action function here
   *
   */

  async createNewTaskList(
    _parent: any,
    {
      data
    }: {
      data: taskInput;
    }
  ) {
    const startToUtc = DateTimeUtils.convertToUTC(data.startDate, 'UTC');
    const endToUtc = DateTimeUtils.convertToUTC(data.endDate, 'UTC');

    const actionResponse = await TaskModelAction.createNewTaskAction({
      name: data.name,
      description: data.description,
      projectId: data.projectId,
      labelId: data.labelId,
      groupId: data.groupId,
      userId: data.assignUserId,
      date: {
        start_date: startToUtc,
        end_date: endToUtc
      }
    });

    return actionResponse;
  }

  async updateTaskList(
    _parent: any,
    { taskId, taskData }: { taskId: string; taskData: taskInput }
  ) {
    const startToUtc = DateTimeUtils.convertToUTC(taskData.startDate, 'UTC');
    const endToUtc = DateTimeUtils.convertToUTC(taskData.endDate, 'UTC');

    const actionResponse = await TaskModelAction.updateTaskAction({
      taskId: taskId,
      name: taskData.name,
      description: taskData.description,
      projectId: taskData.projectId,
      labelIds: taskData.labelId,
      groupId: taskData.groupId,
      userId: taskData.assignUserId,
      date: {
        start_date: startToUtc,
        end_date: endToUtc
      }
    });

    return actionResponse;
  }

  async updateStatusTaskList(
    _parent: any,
    { taskId, projectId }: { taskId: string; projectId: string }
  ) {
    const actionResponse = await TaskModelAction.updateStatusTaskAction({
      projectId: projectId,
      taskId: taskId
    });

    return actionResponse;
  }

  async deleteTempTaskList(
    _parent: any,
    { taskId, projectId }: { taskId: string; projectId: string }
  ) {
    const actionResponse = await TaskModelAction.deleteTempTaskAction({
      projectId: projectId,
      taskId: taskId
    });

    return actionResponse;
  }

  async restoreTaskList(
    _parent: any,
    { taskId, projectId }: { taskId: string; projectId: string }
  ) {
    const actionResponse = await TaskModelAction.restoreTaskAction({
      projectId: projectId,
      taskId: taskId
    });

    return actionResponse;
  }

  async deletePermanentlyTaskList(
    _parent: any,
    { taskId, projectId }: { taskId: string; projectId: string }
  ) {
    const actionResponse = await TaskModelAction.deletePermanentlyTaskAction({
      projectId,
      taskId: taskId
    });
    return actionResponse;
  }
}

export const taskListController = new TaskListController();
