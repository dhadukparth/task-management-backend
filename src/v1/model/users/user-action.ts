import mongoose from 'mongoose';
import { bcryptFn } from '../../../helper/bcrypt';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { generateUniqueKey } from '../../../helper/uuid';
import { userPipelines } from '../../Pipelines';
import { ServerError, ServerResponse } from '../../utils/response';
import { userModel } from './user';
import UserCredentialsAction from './user-credentials';

type CreateUserType = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  tag: string;
  contact_number_code?: string;
  contact_number?: string;
  gender?: string;
  dob?: number;
  blood_group?: string;
  address?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
};

type UpdateUserType = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
  tag: string;
  contact_number_code: string;
  contact_number: string;
  gender: string;
  dob: number;
  blood_group?: string;
  address: string;
  location: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
};

class UserModelAction extends UserCredentialsAction {
  constructor() {
    super();
  }

  async fetchAllUsersAction() {
    try {
      const getAllUsers = await userModel.aggregate([
        ...userPipelines.user_pipelines,
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      console.log(JSON.stringify(getAllUsers));

      if (getAllUsers.length) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'All users fetched successfully', getAllUsers);
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'No users found', null);
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async fetchSingleUsersAction(args: { userId: string }) {
    try {
      const getSingleUsersResult = await userModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(args.userId)
          }
        },
        ...userPipelines.user_pipelines,
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (getSingleUsersResult.length) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'Single users fetched successfully',
          getSingleUsersResult[0]
        );
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async createUserAction(args: CreateUserType) {
    try {
      const checkUser = {
        'email.email_address': args.email
      };

      const checkUserDetails = await userModel.findOne(checkUser);
      if (checkUserDetails) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry, this email address is already existing',
          null
        );
      }

      const hashedPassword = await bcryptFn.hashPassword(args.password);
      const generateUserKey = generateUniqueKey(16, 4);
      const generateVerifyKey = generateUniqueKey(32, 4);

      const newRecord = new userModel({
        name: {
          first_name: args.first_name,
          middle_name: args.middle_name,
          last_name: args.last_name
        },
        email: {
          email_address: args.email,
          verify: false,
          verify_key: generateVerifyKey
        },
        contact: {
          contact_code: args?.contact_number_code ?? null,
          contact_number: args?.contact_number ?? null
        },
        role: new mongoose.Types.ObjectId(args.role),
        tag: new mongoose.Types.ObjectId(args.tag),
        department: new mongoose.Types.ObjectId(args.department),
        profile_picture: null,
        is_active: true,
        gender: null,
        dob: null,
        blood_group: null,
        place_details: {
          address: args?.address ?? null,
          location: args?.location ?? null,
          city: args?.city ?? null,
          state: args?.state ?? null,
          country: args?.country ?? null,
          zip_code: args?.zip_code ?? null
        },
        credentials: {
          user_key: generateUserKey,
          password: hashedPassword,
          otp: null
        },
        social_media: null,
        last_login: null
      });

      const savedUser = await newRecord.save();
      if (savedUser) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'USER CREATED SUCCESSFULLY.', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'SORRY! This user is not created. Please tey again.',
          null
        );
      }
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async updateUserAction(args: { id: string } & UpdateUserType) {
    try {
      // TODO: check the user id and email address and not deleted
      const checkUserIdWithEmail = await userModel.findOne({
        _id: args.id,
        'email.email_address': args.email,
        deleted_at: null
      });
      if (!checkUserIdWithEmail) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      // TODO: check the user email address and verify or not
      const checkUserWithEVerify = await userModel.findOne({
        'email.verify': true
      });
      if (!checkUserWithEVerify) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry, this user email has been not verify.',
          null
        );
      }

      // TODO: check the user email address and verify or not
      const checkUserIsActive = await userModel.findOne({
        is_active: true
      });
      if (!checkUserIsActive) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry, this user is not active user active after change details.',
          null
        );
      }

      const updateUser = await userModel.findOneAndUpdate(
        {
          _id: args.id,
          'email.email_address': args.email,
          'email.verify': true,
          is_active: true,
          deleted_at: null
        },
        {
          $set: {
            'name.first_name': args.first_name,
            'name.middle_name': args.middle_name,
            'name.last_name': args.last_name,
            'contact.contact_code': args.contact_number_code,
            'contact.contact_number': args.contact_number,
            gender: args.gender,
            dob: args.dob,
            blood_group: args?.blood_group,
            'place_details.address': args.address,
            'place_details.location': args.location,
            'place_details.city': args.city,
            'place_details.state': args.state,
            'place_details.country': args.country,
            'place_details.zip_code': args.zip_code
          }
        },
        {
          new: true
        }
      );

      if (updateUser) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'User updated successfully.', true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'User not found with the provided details.',
        null
      );
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  async activeUserStatusAction(args: { email: string }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': true,
        deleted_at: null
      };

      const checkUserDetails: any = await userModel.findOne(checkUser);
      if (!checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      const changeStatus = !checkUserDetails.is_active;

      const updateUser = await userModel.findOneAndUpdate(
        checkUser,
        {
          $set: {
            is_active: changeStatus
          }
        },
        {
          new: true
        }
      );

      if (updateUser) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          `The user has been successfully ${changeStatus ? 'activated' : 'deactivated'}.`,
          true
        );
      }

      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user could not be found.', null);
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  async tempDeleteUserAction(args: { email: string; password: string }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': true,
        is_active: false,
        deleted_at: null
      };

      const checkUserDetails: any = await userModel
        .findOne(checkUser)
        .select('credentials.password email.email_address');
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

      const updateUser = await userModel.findOneAndUpdate(
        checkUser,
        {
          $set: {
            'email.verify': false,
            is_active: false,
            deleted_at: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
          }
        },
        {
          new: true
        }
      );

      if (updateUser) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'This user has been deleted successfully.',
          true
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry, this user could not be deleted.',
        null
      );
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  async recoverDeleteUserAction(args: { email: string; password: string }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': false,
        is_active: false,
        deleted_at: { $ne: null } // Check if deleted_at is not null
      };

      const checkUserDetails: any = await userModel
        .findOne(checkUser)
        .select('credentials.password email.email_address');
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
          false
        );
      }

      const updateUser = await userModel.findOneAndUpdate(
        checkUser,
        {
          $set: {
            'email.verify': true,
            is_active: true,
            deleted_at: null
          }
        },
        {
          new: true
        }
      );

      if (updateUser) {
        return ServerResponse(STATUS_CODE.CODE_OK, `This user has recover successfully.`, true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'Sorry, this user not recover please try again.',
        null
      );
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }
}

export default new UserModelAction();
