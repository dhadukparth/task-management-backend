import { permissionController } from '../../controller';

export default {
  Query: {
    permissions: permissionController.fetchAllPermission,
    permission: permissionController.fetchSinglePermission,
    rollBackPermission: permissionController.rollBackAllPermission
  },
  Mutation: {
    createPermission: permissionController.createPermission,
    updatePermission: permissionController.updatePermission,
    updateStatusPermission: permissionController.updateStatusPermission,
    tempDeletePermission: permissionController.tempDeletePermission,
    rollBackPermission: permissionController.rollbackPermission,
    rollBackDeletePermission: permissionController.rollbackDeletePermission,
  }
};
