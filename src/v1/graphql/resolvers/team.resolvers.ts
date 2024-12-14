import { teamController } from '../../controller';

export default {
  Mutation: {
    createTeam: teamController.createTeam,
    updateTeam: teamController.updateTeam,
    updateStatusTeam: teamController.changeStatusTeam,
    tempDeleteTeam: teamController.deleteTeam
  }
};
