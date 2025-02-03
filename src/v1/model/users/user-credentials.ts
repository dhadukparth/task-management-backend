import { bcryptFn } from '../../../helper/bcrypt';
import { AppCryptoJs } from '../../../helper/cryptojs';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { generateUniqueKey } from '../../../helper/uuid';
import { APP_TIMERS } from '../../constant';
import { cookieStorage } from '../../services/cookies-storage';
import { ServerError, ServerResponse } from '../../utils/response';
import { AppTokens } from '../../utils/tokens';
import { userModel } from './user';

class UserCredentialsAction {
  async userLoginAction(args: { email: string; password: string }, { response }: any) {
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
        APP_TIMERS.ACCESS_TOKEN_EXPIRED
      );

      const generateRefreshToken = await AppTokens.generateToken(
        {
          temp_key: checkUserDetails.credentials.user_key
        },
        APP_TIMERS.REFRESH_TOKEN_EXPIRED
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
        cookieStorage.createCookie(response, '_at', generateAccessToken);

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
      console.log(error);
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
        .select('credentials.password');
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
      // TODO: check user email address and verify
      const checkEmailVerified = await userModel.findOne({
        'email.email_address': args.email,
        'email.verify': true
      });

      if (!checkEmailVerified) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry! This user email address is not verified.',
          null
        );
      }

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

      const generateSecretKey = await generateUniqueKey(
        32,
        4,
        checkUserDetails.email.email_address
      );

      const generateForgoSecretToken = await AppTokens.generateToken(
        {
          email: checkUserDetails.email.email_address,
          key: generateSecretKey
        },
        APP_TIMERS.FP_VERIFY_EXPIRED
      );

      const convertToEncrypt = await AppCryptoJs.encrypt(generateForgoSecretToken);

      const updateUser = await userModel.findOneAndUpdate(
        {
          'email.email_address': args.email
        },
        {
          $set: {
            'credentials.secretKey': generateSecretKey
          }
        },
        {
          new: true
        }
      );

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
      const decryptFPSecretKey = await AppCryptoJs.decrypt(args.verify);
      const verifyToken = await AppTokens.verifyToken(decryptFPSecretKey);

      // TODO: check the key is expire or not
      if (verifyToken.status === 401) {
        return ServerError(verifyToken.status, verifyToken.message, null);
      }

      // TODO: check user email address and verify
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

  async sendVerifyEmailAction(args: { email: string }) {
    try {
      // TODO: check the user id and email address and not deleted
      const checkUserIdWithEmail = await userModel.findOne({
        'email.email_address': args.email,
        deleted_at: null
      });

      if (!checkUserIdWithEmail) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry, this email address does not exist',
          null
        );
      }

      // TODO: check the user email address and verify or not
      const checkUserWithEVerify = await userModel.findOne({
        'email.verify': false
      });

      if (!checkUserWithEVerify) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry, this user email has been already verify.',
          null
        );
      }

      const verifyKey = generateUniqueKey(32, 4);

      const updateVerifyKey = await userModel.findOneAndUpdate(
        { 'email.email_address': args.email, 'email.verify': false },
        { $set: { 'email.verify_key': verifyKey } },
        { new: true }
      );

      if (!updateVerifyKey) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'User with the provided email not found.',
          null
        );
      }

      const verifyToken = await AppCryptoJs.encrypt({
        email: args.email,
        verify: verifyKey
      });

      if (verifyToken) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Verify email send successfully', true);
      } else {
        return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, 'Internal Server Error', null);
      }
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  async verifyEmailAddressAction(args: { verifyKey: string }) {
    try {
      const decryptKey: any = await AppCryptoJs.decrypt(args.verifyKey);

      // TODO: check user email address and verify
      const checkEmailVerified = await userModel.findOne({
        'email.email_address': decryptKey.email,
        'email.verify': false
      });

      if (!checkEmailVerified) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry! This user is already verified.',
          null
        );
      }

      const checkValues = {
        'email.email_address': decryptKey.email,
        'email.verify': false,
        'email.verify_key': decryptKey.verify,
        deleted_at: null
      };

      const findEmailUser = await userModel.findOneAndUpdate(
        checkValues,
        {
          $set: { 'email.verify': true }
        },
        { new: true }
      );

      if (findEmailUser) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Email successfully verified.', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'User with the provided email and verification key not found.',
          null
        );
      }
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }
}

export default UserCredentialsAction;
