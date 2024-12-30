import { teamController } from '../../controller';

export default {
  Query:{
    getAllTeams: teamController.getAllTeam,
    getSingleTeams: teamController.getSingleTeam,
  },
  Mutation: {
    createTeam: teamController.createTeam,
    updateTeam: teamController.updateTeam,
    updateStatusTeam: teamController.changeStatusTeam,
    tempDeleteTeam: teamController.deleteTeam
  }
};
