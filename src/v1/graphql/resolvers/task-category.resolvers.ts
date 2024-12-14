import { taskCategoryController } from "../../controller";

export default {
  Query: {
    getAllTaskCategory: taskCategoryController.getAllTaskCategory,
    getSingleTaskCategory: taskCategoryController.getSingleTaskCategory
  },
  Mutation: {
    createTaskCategory: taskCategoryController.createTaskCategory,
    updateTaskCategory: taskCategoryController.updateTaskCategory,
    updateStatusTaskCategory: taskCategoryController.updateStatusTaskCategory,
    deletePermanentlyTaskCategory: taskCategoryController.deleteTaskCategory
  }
};
