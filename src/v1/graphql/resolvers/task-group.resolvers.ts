import { taskGroupController } from '../../controller';

export default {
  Query: {
    getAllTaskGroupLabel: taskGroupController.getAllTaskGroup,
    getSingleTaskGroupLabel: taskGroupController.getSingleTaskGroup
  },
  Mutation: {
    // group
    createTaskGroup: taskGroupController.createTaskGroup,
    updateTaskGroup: taskGroupController.updateTaskGroup,
    updateStatusTaskGroup: taskGroupController.updateStatusTaskGroup,
    deletePermanentlyTaskGroup: taskGroupController.deletePermanentlyTaskGroup,

    // label
    createTaskLabel: taskGroupController.createTaskLabel,
    updateTaskLabel: taskGroupController.updateTaskLabel,
    updateStatusTaskLabel: taskGroupController.updateStatusTaskLabel,
    deletePermanentlyTaskLabel: taskGroupController.deletePermanentlyTaskLabel
  }
};
