import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { IActionPermission } from '../../types/model/model-action';
import { permissionsModel } from './permissions';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const permission = await permissionsModel.findOne(checkData);

    if (permission === null) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'PERMISSION NOT FOUND',
        data: null
      };
    }

    if (permission.deleted_at && permission.deleted_at.date !== null) {
      return {
        code: STATUS_CODE.CODE_CONFLICT,
        message: 'PERMISSION ALREADY DELETED',
        data: null
      };
    }

    return true;
  } catch (error: any) {
    return {
      code: error?.errorResponse?.code,
      message: error?.errorResponse?.errmsg,
      error: error
    };
  }
};

class PermissionModelAction {
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
      return {
        code: STATUS_CODE.CODE_CREATED,
        message: 'PERMISSION CREATED SUCCESSFULLY',
        data: savedPermission
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchAllPermissionsAction(
    customQuery: any = {
      'deleted_at.date': null
    }
  ): Promise<any> {
    try {
      const permissionList = await permissionsModel.find(customQuery);

      if (!permissionList || permissionList?.length === 0) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'PERMISSION LIST NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'PERMISSION FETCH SUCCESSFULLY',
        data: permissionList
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchSinglePermissionAction({ id }: IActionPermission['single_permission']): Promise<any> {
    try {
      const singlePermission = await permissionsModel.findOne({
        _id: id,
        'deleted_at.date': null
      });

      if (!singlePermission) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'PERMISSION NOT FOUND OR ALREADY DELETED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'PERMISSION FETCHED SUCCESSFULLY',
        data: singlePermission
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
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

      if (!updatedPermission) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'PERMISSION NOT FOUND OR UPDATE FAILED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'PERMISSION UPDATED SUCCESSFULLY',
        data: updatedPermission
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
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

      if (!updatedStatusPermission) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'SORRY! THIS PERMISSION STATUS IS BEEN NOT UPDATED.',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'PERMISSION STATUS UPDATED SUCCESSFULLY',
        data: updatedStatusPermission
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
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

      if (!deletePermission) {
        return {
          code: STATUS_CODE.CODE_CONFLICT,
          message: 'SORRY! THIS PERMISSION COULD NOT BE DELETED!',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'PERMISSION DELETE SUCCESSFULLY',
        data: deletePermission
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
    }
  }

  async rollBackAllPermissionsAction() {
    try {
      const deletePermissionList = await permissionsModel.find({
        'deleted_at.date': { $ne: null }
      });

      if (!deletePermissionList || deletePermissionList?.length === 0) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'DELETE PERMISSION LIST NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'DELETE PERMISSION FETCH SUCCESSFULLY',
        data: deletePermissionList
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async rollbackPermissionAction({
    id,
    name
  }: IActionPermission['roll_back_permission']): Promise<any> {
    try {
      const permissionCheck = await checkRecordFound({ _id: id, name: name });

      if (permissionCheck?.code !== STATUS_CODE.CODE_CONFLICT) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'PERMISSION NOT FOUND',
          data: null
        };
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

      if (!rollbackPermissionAction) {
        return {
          code: STATUS_CODE.CODE_CONFLICT,
          message: 'SORRY! THIS PERMISSION COULD NOT BE RESTORE!',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'PERMISSION RESTORE SUCCESSFULLY',
        data: rollbackPermissionAction
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async rollbackDeletePermissionAction({
    id,
    name
  }: IActionPermission['roll_back_delete_permission']): Promise<any> {
    const permissionCheck = await checkRecordFound({ _id: id, name: name });

    // if (permissionCheck === false || permissionCheck?.code !== 409) {
    //   return {
    //     code: STATUS_CODE.CODE_NOT_FOUND,
    //     message: 'SORRY! THIS PERMISSION IS NOT FOUND!',
    //     data: null
    //   };
    // }

    try {
      const rollbackPermissionAction = await permissionsModel.findOneAndDelete({
        _id: id,
        name: name
        // 'deleted_at.date': { $ne: null }
      });

      if (rollbackPermissionAction) {
        return {
          code: STATUS_CODE.CODE_OK,
          message: 'PERMISSION PERMANENTLY DELETED SUCCESSFULLY',
          data: rollbackPermissionAction
        };
      } else {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'SORRY! THIS PERMISSION HAS BEEN NOT DELETED!',
          data: null
        };
      }
    } catch (error: any) {
      return {
        code: STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: 'Error while rolling back permission',
        error: error
      };
    }
  }
}

export default new PermissionModelAction();
