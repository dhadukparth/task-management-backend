import { userController } from '../../controller';

export default {
  Query: {
    allUsers: userController.getAllUsers,
    singleUsers: userController.getSingleUsers,
  },
  Mutation: {
    createUser: userController.createUser,
    sendVerifyEmail: userController.sendVerifyEmail,
    verifyEmailAddress: userController.verifyEmailAddress,
    updateUser: userController.updateUser,
    activeUserStatus: userController.deActiveUser,

    changeUserPassword: userController.changeNewUserPassword,

    // forgot password
    sendResetVerifyKeyUserPassword: userController.sendForgotEmailPassword,
    resetUserPassword: userController.resetNewUserPassword,

    tempDeleteUser: userController.tempDeleteUser,
    recoverDeleteUser: userController.recoverDeleteUser,

    // Login
    userLogin: userController.userLogin
  }
};