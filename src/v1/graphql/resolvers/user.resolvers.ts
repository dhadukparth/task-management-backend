import { userController } from '../../controller';

export default {
  Query: {
    allUsers: userController.getAllUsers,
    singleUsers: userController.getSingleUsers
  },
  Mutation: {
    createUser: userController.createUser,
    updateUser: userController.updateUser,
    activeUserStatus: userController.deActiveUser,

    tempDeleteUser: userController.tempDeleteUser,
    recoverDeleteUser: userController.recoverDeleteUser
  }
};
