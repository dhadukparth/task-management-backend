import DateTimeUtils from '../../helper/moment';
import STATUS_CODE from '../../helper/statusCode';
import userAction from '../model/users/user-action';
import { IUserAction } from '../types/model/model-action';
import { generatePassword } from '../utils/common';
import { ServerError, ServerResponse } from '../utils/response';
import { AppTokens } from '../utils/tokens';
import UserCredentialsController from './user-credentials.controller';

class UserController extends UserCredentialsController {
  constructor() {
    super();
  }

  async getAllUsers() {
    const apiResponse: any = await userAction.fetchAllUsersAction();

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(STATUS_CODE.CODE_OK, 'Users fetched successfully.', apiResponse?.data);
    } else {
      return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
    }
  }

  /**
   * Creates a new user in the system.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param userData - The data required to create a new user, including name, email, role, etc.
   *
   */
  async createUser(_parent: any, { userData }: { userData: any }) {
    const payload = {
      first_name: userData.firstName,
      middle_name: userData.middleName,
      last_name: userData.lastName,
      email: userData.email,
      role: userData.roleId,
      department: userData.departmentId,
      tag: userData.tagId,
      contact_number_code: userData?.contactCode ?? null,
      contact_number: userData?.contactNumber ?? null,
      gender: userData?.gender ?? null,
      dob: userData?.dob ?? null,
      blood_group: userData?.bloodGroup ?? null,
      address: userData?.address ?? null,
      location: userData?.location ?? null,
      city: userData?.city ?? null,
      state: userData?.state ?? null,
      country: userData?.country ?? null,
      zip_code: userData?.zip_code ?? null,
      password: generatePassword()
    };

    const apiResponse: any = await userAction.createUserAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_CREATED) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
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

  /**
   * Updates user details in the system.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param userData - The updated user details, such as name, role, and contact information.
   *
   */
  async updateUser(_parent: any, { userData }: { userData: any }) {
    const payload = {
      first_name: userData.firstName,
      middle_name: userData.middleName,
      last_name: userData.lastName,
      email: userData.email,
      role: userData.roleId,
      department: userData.departmentId,
      tag: userData.tagId,
      contact_number_code: userData.contactCode,
      contact_number: userData.contactNumber,
      gender: userData.gender,
      dob: DateTimeUtils.convertToUTC(userData.dob, 'UTC'),
      blood_group: userData?.bloodGroup ?? null,
      address: userData.address,
      location: userData.location,
      city: userData.city,
      state: userData.state,
      country: userData.country,
      zip_code: userData.zipCode
    };

    const apiResponse: any = await userAction.updateUserAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  /**
   * Deactivates a user account based on their email address.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param email - The email address of the user to deactivate.
   *
   */
  async deActiveUser(_parent: any, { email }: { email: string }) {
    const payload = {
      email: email
    };

    const apiResponse: any = await userAction.activeUserStatusAction(payload);

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(apiResponse?.status, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  /**
   * Temporarily deletes a user account, marking it for potential restoration later.
   *
   * @param _parent - The parent resolver, typically unused.
   * @param userData - Details of the user to temporarily delete.
   *
   */
  async tempDeleteUser(_parent: any, { userData }: { userData: any }) {
    const apiResponse: any = await userAction.tempDeleteUserAction({
      email: userData.email,
      password: userData.password
    });

    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(STATUS_CODE.CODE_OK, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }

  async recoverDeleteUser(
    _parent: any,
    { userData }: { userData: IUserAction['recover_delete_user'] }
  ) {
    const payload = {
      email: userData.email,
      password: userData.password
    };

    const apiResponse: any = await userAction.recoverDeleteUserAction(payload);
    if (apiResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(STATUS_CODE.CODE_OK, apiResponse?.message, apiResponse?.data);
    }

    return ServerError(apiResponse?.status, apiResponse?.message, apiResponse?.error);
  }
}

export const userController = new UserController();
