import mongoose from 'mongoose';
import { bcryptFn } from '../../../helper/bcrypt';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { generateUniqueKey } from '../../../helper/uuid';
import { APP_TIMERS, MODEL_COLLECTION_LIST } from '../../constant';
import { ServerError, ServerResponse } from '../../utils/response';
import { AppTokens } from '../../utils/tokens';
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
        {
          $match: {}
        },
        {
          $lookup: {
            from: MODEL_COLLECTION_LIST.ROLES, // The collection name for roles
            localField: 'role', // The field in the users collection that holds the ObjectId
            foreignField: '_id', // The field in tbl_roles to match with role
            as: 'roleData' // The output array field for matched role documents
          }
        },
        // {
        //   $lookup: {
        //     from: MODEL_COLLECTION_LIST.DEPARTMENT,
        //     localField: 'department',
        //     foreignField: '_id',
        //     as: 'departmentData'
        //   }
        // },
        // {
        //   $lookup: {
        //     from: MODEL_COLLECTION_LIST.USER_TAGS,
        //     localField: 'tag',
        //     foreignField: '_id',
        //     as: 'tagData'
        //   }
        // },
        {
          $addFields: {
            createdAt: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
              }
            },
            date_of_birth: {
              $cond: {
                if: { $eq: ['$dob', null] }, // Check if `dob` is null
                then: '', // Set to an empty string if null
                else: {
                  $dateToString: {
                    format: '%Y-%m-%d', // Format the date as YYYY-MM-DD
                    date: { $toDate: '$dob' } // Convert `dob` timestamp to a date
                  }
                }
              }
            },
            social_media: {
              $cond: {
                if: { $eq: ['$social_media', null] }, // Check if `social_media` is null
                then: [], // Set to an empty array if null
                else: '$social_media' // Retain the original value if not null
              }
            },
            gender: {
              $cond: {
                if: { $eq: ['$gender', null] }, // Check if `gender` is null
                then: '', // Set to an empty string if null
                else: '$gender' // Retain the original value if not null
              }
            }
          }
        },
        {
          $project: {
            'name.first_name': 1,
            'name.middle_name': 1,
            'name.last_name': 1,
            'email.email_address': 1,
            'contact.contact_code': 1,
            'contact.contact_number': 1,
            gender: 1,
            dob: 1,
            blood_group: 1,
            'roleData.name': 1,
            'place_details.address': 1,
            'place_details.location': 1,
            'place_details.city': 1,
            'place_details.state': 1,
            'place_details.country': 1,
            'place_details.zip_code': 1,
            social_media: 1
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      return ServerResponse(STATUS_CODE.CODE_OK, 'All users fetched successfully', getAllUsers);
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async createUserAction(args: CreateUserType) {
    try {
      const checkUser = {
        'email.email_address': args.email
      };

      const checkUserDetails = await userModel.findOne(checkUser);
      if (checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_CONFLICT, 'Sorry, this user is already existing', null);
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

  async updateUserAction(args: UpdateUserType) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': true,
        is_active: true,
        deleted_at: null
      };

      const checkUserDetails = await userModel.findOne(checkUser);
      if (!checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      const updateUser = await userModel.findOneAndUpdate(
        checkUser,
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

  async sendVerifyEmailAction(args: { email: string }) {
    try {
      const checkUser = {
        'email.email_address': args.email,
        'email.verify': false,
        is_active: true,
        deleted_at: null
      };

      const checkUserDetails: any = await userModel.findOne(checkUser);
      if (!checkUserDetails) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry, this user does not exist', null);
      }

      const verifyKey = generateUniqueKey(32, 4);

      const updateVerifyKey = await userModel.findOneAndUpdate(
        { 'email.email_address': args.email },
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

      const verifyToken = await AppTokens.generateToken(
        {
          email: args.email,
          verify: verifyKey
        },
        APP_TIMERS.SEND_VERIFY_EXPIRED
      );

      if (verifyToken) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Verify email send successfully', true);
      }

      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, 'Internal Server Error', null);
    } catch (error: any) {
      const message = error?.errorResponse?.errmsg || 'Internal Server Error';
      return ServerError(STATUS_CODE.CODE_INTERNAL_SERVER_ERROR, message, error);
    }
  }

  async verifyEmailAddressAction(args: { verifyKey: string; email: string }) {
    try {
      const checkValues = {
        'email.email_address': args.email,
        'email.verify_key': args.verifyKey,
        'email.verify': false,
        is_active: true,
        deleted_at: null
      };

      const checkEmailVerified = await userModel.findOne(checkValues);

      if (!checkEmailVerified) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry! This email address is already verified.',
          null
        );
      }

      const findEmailUser = await userModel.findOneAndUpdate(
        checkValues,
        {
          $set: { 'email.verify': true }
        },
        { new: true }
      );

      if (!findEmailUser) {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'User with the provided email and verification key not found.',
          null
        );
      }

      return ServerResponse(STATUS_CODE.CODE_OK, 'Email successfully verified.', true);
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
