import mongoose from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { IActionPermission } from '../../types/model/model-action';
import { ServerError, ServerResponse } from '../../utils/response';
import { permissionsModel } from './permissions';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const permission = await permissionsModel.findOne(checkData);

    if (permission === null) {
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'PERMISSION NOT FOUND', null);
    }

    if (permission.deleted_at && permission.deleted_at.date !== null) {
      return ServerError(STATUS_CODE.CODE_CONFLICT, 'PERMISSION ALREADY DELETED', null);
    }

    return true;
  } catch (error: any) {
    return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
  }
};

class PermissionModelAction {
  /**
   *
   * @param status: passing number indicating  1: not deleted, 2: deleted
   *
   */
  async fetchAllPermissionsAction({ status }: { status: number }): Promise<any> {
    try {
      const permissionList = await permissionsModel.aggregate([
        {
          $match: {
            $expr: {
              $cond: {
                if: { $eq: [status, 1] },
                then: {
                  $and: [
                    { $eq: ['$deleted_at.date', null] },
                    { $eq: ['$deleted_at.user_id', null] }
                  ]
                },
                else: {
                  $or: [{ $ne: ['$deleted_at.date', null] }, { $ne: ['$deleted_at.user_id', null] }]
                }
              }
            }
          }
        },
        {
          $addFields: {
            created_at: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
              }
            }
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (permissionList?.length) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'PERMISSION FETCH SUCCESSFULLY', permissionList);
      }

      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'PERMISSION LIST NOT FOUND', null, []);
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async fetchSinglePermissionAction({ id }: IActionPermission['single_permission']): Promise<any> {
    try {
      const singlePermission = await permissionsModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            is_active: true,
            'deleted_at.date': { $eq: null },
            'deleted_at.user_id': { $eq: null }
          }
        },
        {
          $addFields: {
            created_at: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
              }
            }
          }
        },
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (singlePermission?.length) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'PERMISSION FETCHED SUCCESSFULLY',
          singlePermission[0]
        );
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'PERMISSION NOT FOUND OR ALREADY DELETED',
        null,
        null
      );
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async createPermissionAction({
    name,
    description
  }: IActionPermission['create_permission']): Promise<any> {
    try {
      const newPermission = new permissionsModel({
        name: name,
        description: description
      });

      const savedPermission = await newPermission.save();
      if (savedPermission) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'PERMISSION CREATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'Sorry! This permission is not created, Please try again.',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updatePermissionAction({
    id,
    name,
    description
  }: IActionPermission['update_permission']): Promise<any> {
    try {
      const permissionCheck = await checkRecordFound({ _id: id });

      if (typeof permissionCheck !== 'boolean') {
        return permissionCheck;
      }

      const updatedPermission = await permissionsModel.findByIdAndUpdate(
        { _id: id, 'deleted_at.date': null },
        { name, description },
        { new: true }
      );

      if (updatedPermission) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'PERMISSION UPDATED SUCCESSFULLY', true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_MODIFIED,
        'PERMISSION NOT FOUND OR UPDATE FAILED',
        null
      );
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updateStatusPermissionAction({
    id,
    status
  }: IActionPermission['update_status_permission']): Promise<any> {
    try {
      const checkPermissionAction = await checkRecordFound({ _id: id });

      if (typeof checkPermissionAction !== 'boolean') {
        return checkPermissionAction;
      }

      const updatedStatusPermission = await permissionsModel.findByIdAndUpdate(
        { _id: id, 'deleted_at.date': null },
        {
          $set: {
            is_active: status
          }
        },
        { new: true }
      );

      if (updatedStatusPermission) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'PERMISSION STATUS UPDATED SUCCESSFULLY', true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_MODIFIED,
        'SORRY! THIS PERMISSION STATUS IS BEEN NOT UPDATED.',
        null
      );
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async tempDeletePermissionAction({
    id
  }: IActionPermission['temp_delete_permission']): Promise<any> {
    try {
      const permissionCheck = await checkRecordFound({ _id: id });

      if (typeof permissionCheck !== 'boolean') {
        return permissionCheck;
      }

      const deletePermission = await permissionsModel.findByIdAndUpdate(
        { _id: id, 'deleted_at.date': null },
        {
          $set: {
            'deleted_at.date': DateTimeUtils.getToday(),
            'deleted_at.user_id': null
          }
        },
        { new: true }
      );

      if (deletePermission) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'PERMISSION DELETE SUCCESSFULLY', true);
      }

      return ServerError(
        STATUS_CODE.CODE_CONFLICT,
        'SORRY! THIS PERMISSION COULD NOT BE DELETED!',
        null
      );
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async rollbackPermissionAction({
    id,
    name
  }: IActionPermission['roll_back_permission']): Promise<any> {
    try {
      const permissionCheck = await checkRecordFound({ _id: id, name: name });
      
      if (permissionCheck?.status !== STATUS_CODE.CODE_CONFLICT) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'PERMISSION NOT FOUND', null);
      }

      const rollbackPermissionAction = await permissionsModel.findByIdAndUpdate(
        { _id: id, name: name, 'deleted_at.date': { $ne: null } },
        {
          $set: {
            'deleted_at.date': null,
            'deleted_at.user_id': null
          }
        },
        { new: true }
      );

      if (rollbackPermissionAction) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'PERMISSION RESTORE SUCCESSFULLY', true);
      }
      return ServerError(
        STATUS_CODE.CODE_CONFLICT,
        'SORRY! THIS PERMISSION COULD NOT BE RESTORE!',
        null
      );
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async rollbackDeletePermissionAction({
    id,
    name
  }: IActionPermission['roll_back_delete_permission']): Promise<any> {
    try {
      const rollbackPermissionAction = await permissionsModel.findOneAndDelete({
        _id: id,
        name: name
      });

      if (rollbackPermissionAction) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'PERMISSION PERMANENTLY DELETED SUCCESSFULLY',
          true
        );
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'SORRY! THIS PERMISSION HAS BEEN NOT DELETED!',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }
}

export default new PermissionModelAction();
