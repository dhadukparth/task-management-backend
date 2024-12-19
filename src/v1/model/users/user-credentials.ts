import { bcryptFn } from '../../../helper/bcrypt';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { APP_TIMERS } from '../../constant';
import { ServerError, ServerResponse } from '../../utils/response';
import { AppTokens } from '../../utils/tokens';
import { userModel } from './user';

class UserCredentialsAction {
  async userLoginAction(args: { email: string; password: string }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        is_active: true,
        deleted_at: null
      };

      const checkUserDetails: any = await userModel
        .findOne(checkUser)
        .select('credentials.password credentials.user_key email name');
      if (!checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      const checkPassword = await bcryptFn.verifyPassword(
        args.password,
        checkUserDetails.credentials.password
      );
      if (!checkPassword) {
        return ServerResponse(
          STATUS_CODE.CODE_UNAUTHORIZED,
          'Incorrect password. Please try again.',
          null
        );
      }

      const generateAccessToken = await AppTokens.generateToken(
        {
          first_name: checkUserDetails.name.first_name,
          middle_name: checkUserDetails.name.middle_name,
          last_name: checkUserDetails.name.last_name,
          email: checkUserDetails.email.email_address,
          temp_key: checkUserDetails.credentials.user_key
        },
        '1d'
      );

      const generateRefreshToken = await AppTokens.generateToken(
        {
          temp_key: checkUserDetails.credentials.user_key
        },
        '30d'
      );

      const updateLoginTokens = await userModel.findOneAndUpdate(
        {
          'email.email_address': checkUserDetails.email.email_address,
          'credentials.user_key': checkUserDetails.credentials.user_key
        },
        {
          $push: {
            last_token: [
              {
                data: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
                token: {
                  auth_token: generateAccessToken,
                  refresh_token: generateRefreshToken
                }
              }
            ]
          }
        },
        { new: true }
      );

      if (updateLoginTokens) {
        return ServerResponse(STATUS_CODE.CODE_OK, `User login successfully.`, {
          accessToken: generateAccessToken,
          refreshToken: generateRefreshToken
        });
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry, this user is not login please try again!.',
        null
      );
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  // update password

  async changeUserPasswordAction(args: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': true,
        is_active: true,
        deleted_at: null
      };

      const checkUserDetails: any = await userModel
        .findOne(checkUser)
        .select('credentials.password email');
      if (!checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      const checkPassword = await bcryptFn.verifyPassword(
        args.currentPassword,
        checkUserDetails.credentials.password
      );
      if (!checkPassword) {
        return ServerResponse(
          STATUS_CODE.CODE_UNAUTHORIZED,
          'Incorrect password. Please try again.',
          false
        );
      }

      const newPasswordHash = await bcryptFn.hashPassword(args.newPassword);

      const updateUser = await userModel.findOneAndUpdate(
        checkUser,
        {
          $set: {
            'credentials.password': newPasswordHash
          }
        },
        {
          new: true
        }
      );

      if (updateUser) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          `User password has been change successfully.`,
          true
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry, this user could not be found during the.',
        false
      );
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  // forgot password
  async sendForgotPasswordAction(args: { email: string }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': true,
        is_active: true,
        deleted_at: null
      };

      const checkUserDetails: any = await userModel
        .findOne(checkUser)
        .select('email.email_address credentials.secretKey credentials.user_key');
      if (!checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      const generateForgoSecretToken = await AppTokens.generateToken(
        {
          email: checkUserDetails.email.email_address,
          key: checkUserDetails.credentials.user_key
        },
        APP_TIMERS.SEND_VERIFY_EXPIRED
      );

      const updateUser = await userModel.findOneAndUpdate(
        {
          'email.email_address': args.email,
          'credentials.user_key': checkUserDetails.credentials.user_key
        },
        {
          $set: {
            'credentials.secretKey': generateForgoSecretToken
          }
        },
        {
          new: true
        }
      );

      console.log(generateForgoSecretToken);

      if (updateUser) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'A reset password verification key has been sent successfully to the registered email address.',
          true
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry, the user with the provided email address could not be found.',
        null
      );
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  async resetUserPasswordAction(args: { email: string; verify: string; newPassword: string }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': true,
        is_active: true,
        deleted_at: null
      };

      const checkUserDetails: any = await userModel.findOne(checkUser);
      if (!checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      const newPasswordHash = await bcryptFn.hashPassword(args.newPassword);

      const updateUser = await userModel.findOneAndUpdate(
        checkUser,
        {
          $set: {
            'credentials.password': newPasswordHash
          }
        },
        {
          new: true
        }
      );

      if (updateUser) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'User password has been change successfully.',
          true
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry, this user could not be found during the.',
        null
      );
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }
}

export default UserCredentialsAction;
