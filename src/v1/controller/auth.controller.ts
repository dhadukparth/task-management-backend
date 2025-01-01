import STATUS_CODE from '../../helper/statusCode';
import userAction from '../model/users/user-action';
import { ServerError, ServerResponse } from '../utils/response';
import { AppTokens } from '../utils/tokens';

class AuthController {
  /**
   * Handles user login by validating credentials and generating authentication tokens.
   *
   * @param {any} _parent - The parent resolver, unused in this function.
   * @param {{ userData: any }} args - Contains user email and password for login.
   *
   */
  async userLogin(_parent: any, { userData }: { userData: any }) {
    const payload = {
      email: userData.email,
      password: userData.password
    };

    const apiResponse: any = await userAction.userLoginAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  /**
   * Sends an email to reset the password for a user's account.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param email - The email address to send the password reset email to.
   *
   */
  async sendForgotEmailPassword(_parent: any, { email }: { email: string }) {
    const apiResponse: any = await userAction.sendForgotPasswordAction({ email: email });

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  /**
   * Resets the password for a user, typically after verifying a reset key.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param userData - User details, including the reset key and new password.
   *
   */
  async resetNewUserPassword(_parent: any, { userData }: { userData: any }) {
    const payload = {
      email: userData.email,
      verify: userData.verify_token,
      newPassword: userData.newPassword
    };

    const decodeVerifyKey: any = await AppTokens.verifyToken(payload.verify);

    if (decodeVerifyKey.status !== STATUS_CODE.CODE_OK) {
      return ServerError(decodeVerifyKey.status, decodeVerifyKey.message, decodeVerifyKey.error);
    }

    const apiResponse: any = await userAction.resetUserPasswordAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, true);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  /**
   * Changes the password for a user, requiring the current password for verification.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param userData - User details, including current and new passwords.
   *
   */
  async changeNewUserPassword(_parent: any, { userData }: { userData: any }) {
    const payload = {
      email: userData.email,
      currentPassword: userData.currentPassword,
      newPassword: userData.newPassword
    };

    const apiResponse: any = await userAction.changeUserPasswordAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, null);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  /**
   * Sends a verification email to a newly created user.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param args - Arguments containing email details for sending the verification email.
   *
   */
  async sendVerifyEmail(_parent: any, { email }: { email: string }) {
    const payload = {
      email: email
    };

    const apiResponse: any = await userAction.sendVerifyEmailAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(
        STATUS_CODE.CODE_OK,
        'Verification email sent successfully.',
        apiResponse?.data
      );
    }
    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  /**
   * Verifies a user's email address using a verification key.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param args - Arguments containing the email address and verification key.
   *
   */
  async verifyEmailAddress(_parent: any, { verify }: { verify: string }) {
    const decodeVerifyKey: any = await AppTokens.verifyToken(verify);

    if (decodeVerifyKey.status !== STATUS_CODE.CODE_OK) {
      return ServerError(decodeVerifyKey.status, decodeVerifyKey.message, decodeVerifyKey.error);
    }

    const payload = {
      email: decodeVerifyKey?.decoded?.email,
      verifyKey: decodeVerifyKey?.decoded?.verify
    };

    const apiResponse: any = await userAction.verifyEmailAddressAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(STATUS_CODE.CODE_OK, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }
}

export const authController = new AuthController();
