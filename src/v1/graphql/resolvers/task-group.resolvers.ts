import { taskGroupController } from "../../controller";

export default {
  Query: {
    getAllTaskGroup: taskGroupController.getAllTaskGroup,
    getSingleTaskGroup: taskGroupController.getSingleTaskGroup
  },
  Mutation: {
    createTaskGroup: taskGroupController.createTaskGroup,
    updateTaskGroup: taskGroupController.updateTaskGroup,
    updateStatusTaskGroup: taskGroupController.updateStatusTaskGroup,
    deletePermanentlyTaskGroup: taskGroupController.deleteTaskGroup
  }
};
