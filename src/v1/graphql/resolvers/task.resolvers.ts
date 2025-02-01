import { taskListController } from '../../controller';

export default {
  Query: {
    getAllTaskList: taskListController.getAllTaskList,
    getSingleTaskList: taskListController.getSingleTaskList
  },
  Mutation: {
    createTaskList: taskListController.createNewTaskList,
    updateTaskList: taskListController.updateTaskList,
    updateTaskStatusList: taskListController.updateStatusTaskList,
    deleteTempTaskList: taskListController.deleteTempTaskList,
    restoreTempTaskList: taskListController.restoreTaskList,
    deletePermanentlyTaskList: taskListController.deletePermanentlyTaskList
  }
};
