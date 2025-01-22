import { projectController } from '../../controller';

export default {
  Query: {
    getAllProjects: projectController.getAllProjects,
    getSingleProject: projectController.getSingleProjects
  },
  Mutation: {
    createProject: projectController.createProject,
    updateProject: projectController.updateProject,
    updateStatusProject: projectController.updateStatusProject,
    deleteTempProject: projectController.deleteTempProject,
    recoverTempProject: projectController.recoverTempProject,
    deletePermanentlyProject: projectController.deletePermanentlyProject
  }
};
