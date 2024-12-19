import { rolesController } from '../../controller';

export default {
  Query: {
    allRoles: rolesController.fetchAllRoles,
    singleRoles: rolesController.fetchSingleRoles,
    deleteAllRoles: rolesController.deleteAllRoles,
    rolesAccessControl: rolesController.fetchRoleAccessController
  },
  Mutation: {
    createRoles: rolesController.createRoles,
    updateRoles: rolesController.updateRoles,
    updateStatusRole: rolesController.updateStatusRoles,
    tempDeleteRoles: rolesController.tempDeleteRoles,
    restoreRoles: rolesController.restoreRoles,
    permanentlyDeleteRoles: rolesController.permanentlyDeleteRoles
  }
};
