import { projectController } from '../../controller';

export default {
  Query: {
    getAllProjects: projectController.getAllProjects,
    getSingleProject: projectController.getSingleProjects,
  },
  Mutation: {
    createProject: projectController.createProject,
    updateProject: projectController.updateProject,
    updateStatusProject: projectController.updateStatusProject,
    deleteTempPermission: projectController.deleteTempProject,
    deletePermanentlyProject: projectController.deletePermanentlyProject,
  }
};
