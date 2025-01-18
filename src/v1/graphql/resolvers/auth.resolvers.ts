import { authController } from '../../controller';

export default {
  Mutation: {
    // Login
    userLogin: authController.userLogin,

    // forgot password
    sendFPEmail: authController.sendForgotEmailPassword,
    resetFPVerify: authController.resetNewUserPassword,

    // send and verify email address
    sendVerifyEmail: authController.sendVerifyEmail,
    verifyEmailAddress: authController.verifyEmailAddress,

    // change new password
    changeUserPassword: authController.changeNewUserPassword
  }
};
