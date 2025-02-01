import mongoose from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { rolePipelines } from '../../Pipelines';
import { IActionRoles } from '../../types/model/model-action';
import { ServerError, ServerResponse } from '../../utils/response';
import { rolesModel } from './roles';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const fetchRoles = await rolesModel.findOne(checkData);

    if (fetchRoles === null) {
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'ROLES NOT FOUND', null);
    }

    if (fetchRoles.deleted_at && fetchRoles.deleted_at.date !== null) {
      return ServerError(STATUS_CODE.CODE_CONFLICT, 'ROLES ALREADY DELETED', null);
    }

    return true;
  } catch (error: any) {
    return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
  }
};

class RolesModelAction {
  /**
   *
   *  Fetch data all functions here
   *
   */

  /**
   *
   * @param status: passing number indicating  1: not deleted, 2: deleted
   *
   */
  async fetchAllRolesAction({ status }: { status: number }): Promise<any> {
    try {
      const rolesList = await rolesModel.aggregate([
        {
          $match: {
            // is_active: true,
            $expr: {
              $cond: [
                { $eq: [status, 1] }, // If status is 1
                {
                  $and: [
                    { $eq: ['$deleted_at.date', null] }, // Check if deleted_at.date is null
                    {
                      $or: [
                        { $eq: ['$deleted_at.user_id', null] },
                        { $ne: ['$deleted_at.user_id', null] }
                      ]
                    } // Optional: user_id can be null or not null
                  ]
                },
                {
                  $and: [
                    { $ne: ['$deleted_at.date', null] }, // If status is 0, check deleted_at.date is not null
                    {
                      $or: [
                        { $eq: ['$deleted_at.user_id', null] },
                        { $ne: ['$deleted_at.user_id', null] }
                      ]
                    } // Optional: user_id can be null or not null
                  ]
                }
              ]
            }
          }
        },
        ...rolePipelines.rolesList_pipeline,
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (rolesList?.length) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'ROLES FETCH SUCCESSFULLY', rolesList);
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'SORRY! ROLES LIST NOT FOUND', null, []);
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async fetchSingleRoleAction({ id, name }: IActionRoles['single_roles']): Promise<any> {
    try {
      const rolesList = await rolesModel.aggregate([
        {
          $match: {
            $or: [{ _id: new mongoose.Types.ObjectId(id) }, { name: name }],
            is_active: true,
            'deleted_at.date': null
          }
        },
        ...rolePipelines.rolesList_pipeline,
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (rolesList?.length) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'ROLES FETCH SUCCESSFULLY', rolesList[0]);
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'SORRY! ROLES LIST NOT FOUND', null, []);
      }
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
    }
  }

  /**
   *
   *  Action all functions here
   *
   */

  async createRolesAction({
    name,
    description,
    accessControl
  }: IActionRoles['create_roles']): Promise<any> {
    try {
      const checkRoles = await checkRecordFound({ name: name });

      if (checkRoles?.status === STATUS_CODE.CODE_CONFLICT) {
        return checkRoles;
      }

      if (checkRoles === true) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'SORRY! THIS ROLES IS ALREADY EXISTING!',
          null
        );
      }

      const modelAccessControl = accessControl.map((item) => ({
        feature_id: item.feature_id,
        permission_id: item.permission_id
      }));

      const newRoles = new rolesModel({
        name: name,
        description: description,
        access_control: modelAccessControl
      });
      const savedRoles = await newRoles.save();

      if (savedRoles) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'ROLES CREATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'Sorry! This role is not created. Please try again',
          null,
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updateRolesAction({
    id,
    name,
    description,
    accessControl
  }: IActionRoles['update_roles']): Promise<any> {
    try {
      const checkRoleAction = await checkRecordFound({ _id: id });

      if (typeof checkRoleAction !== 'boolean') {
        return checkRoleAction;
      }

      const updatedRoles = await rolesModel.findByIdAndUpdate(
        { _id: id, 'deleted_at.date': null },
        {
          $set: {
            name: name,
            description: description,
            access_control: accessControl
          }
        },
        { new: true }
      );

      if (updatedRoles) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'ROLE IS UPDATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_MODIFIED,
          'SORRY! THIS ROLES IS NOT UPDATE FAILED',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updateStatusRoleAction({ id, status }: IActionRoles['update_status_roles']): Promise<any> {
    try {
      const checkRoleAction = await checkRecordFound({ _id: id });

      if (typeof checkRoleAction !== 'boolean') {
        return checkRoleAction;
      }

      const updatedStatusRoles = await rolesModel.findByIdAndUpdate(
        { _id: id, is_active: !status, 'deleted_at.date': null },
        {
          $set: {
            is_active: status
          }
        },
        { new: true }
      );

      const statusLabel = status ? 'Active' : 'Deactivated';

      if (updatedStatusRoles) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          `This Role is ${statusLabel} successfully.`,
          true
        );
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_MODIFIED,
          'SORRY! THIS ROLES STATUS IS BEEN NOT UPDATED.',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async tempDeleteRoleAction({ id }: IActionRoles['temp_delete_roles']): Promise<any> {
    try {
      const rolesCheck = await checkRecordFound({ _id: id });

      if (typeof rolesCheck !== 'boolean') {
        return rolesCheck;
      }

      const deleteRolesAction = await rolesModel.findByIdAndUpdate(
        { _id: id, 'deleted_at.date': null },
        {
          $set: {
            'deleted_at.date': DateTimeUtils.getToday(),
            'deleted_at.user_id': null
          }
        },
        { new: true }
      );

      if (deleteRolesAction) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'ROLE DELETE SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'SORRY! THIS ROLE COULD NOT BE DELETED!',
          null
        );
      }
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
    }
  }

  async restoreRoleAction({ id, name }: IActionRoles['roll_back_roles']): Promise<any> {
    try {
      const rolesCheckAction = await checkRecordFound({ _id: id, name: name });

      if (rolesCheckAction?.status !== STATUS_CODE.CODE_CONFLICT) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'ROLES NOT FOUND', null);
      }

      const rollbackRolesAction = await rolesModel.findByIdAndUpdate(
        { _id: id, name: name, 'deleted_at.date': { $ne: null } },
        {
          $set: {
            'deleted_at.date': null,
            'deleted_at.user_id': null
          }
        },
        { new: true }
      );

      if (rollbackRolesAction) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'ROLES RESTORE SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'SORRY! THIS ROLES COULD NOT BE RESTORE!',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async permanentlyDeleteRoleAction({
    id,
    name
  }: IActionRoles['permanently_delete_roles']): Promise<any> {
    try {
      const rolesCheckAction = await checkRecordFound({ _id: id, name: name });

      // if (rolesCheckAction === true || rolesCheckAction?.code !== 409) {
      //   return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'SORRY! THIS ROLES IS NOT FOUND!', null);
      // }

      const rollbackRolesAction = await rolesModel.findOneAndDelete({
        _id: id,
        name: name
        // 'deleted_at.date': { $ne: null }
      });

      if (rollbackRolesAction) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'ROLE PERMANENTLY DELETED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'SORRY! THIS ROLE HAS BEEN NOT DELETED!',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }
}

export default new RolesModelAction();
