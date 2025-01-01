import { authController } from '../../controller';

export default {
  Mutation: {
    // forgot password
    sendResetVerifyKeyUserPassword: authController.sendForgotEmailPassword,
    resetUserPassword: authController.resetNewUserPassword,

    sendVerifyEmail: authController.sendVerifyEmail,
    verifyEmailAddress: authController.verifyEmailAddress,

    changeUserPassword: authController.changeNewUserPassword,

    // Login
    userLogin: authController.userLogin
  }
};
