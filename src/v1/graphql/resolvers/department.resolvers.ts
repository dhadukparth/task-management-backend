import { departmentController } from '../../controller';

export default {
  Query: {
    getAllDepartment: departmentController.fetchAllDepartment,
    getSingleDepartment: departmentController.fetchSingleDepartment
  },
  Mutation: {
    createDepartment: departmentController.createDepartment,
    updateDepartment: departmentController.updateDepartment,
    updateStatusDepartment: departmentController.updateStatusDepartment,
    deletePermanentlyDepartment: departmentController.deletePermanentlyDepartment
  }
};
