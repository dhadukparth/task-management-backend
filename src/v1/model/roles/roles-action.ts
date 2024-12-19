import { isValidObjectId } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import STATUS_CODE from '../../../helper/statusCode';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IActionRoles } from '../../types/model/model-action';
import { rolesModel } from './roles';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const fetchRoles = await rolesModel.findOne(checkData);

    if (fetchRoles === null) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'ROLES NOT FOUND',
        data: null
      };
    }

    if (fetchRoles.deleted_at && fetchRoles.deleted_at.date !== null) {
      return {
        code: STATUS_CODE.CODE_CONFLICT,
        message: 'ROLES ALREADY DELETED',
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

class RolesModelAction {
  async createRolesAction({
    name,
    description,
    accessControl
  }: IActionRoles['create_roles']): Promise<any> {
    try {
      const checkRoles = await checkRecordFound({ name: name });

      if (checkRoles?.code === STATUS_CODE.CODE_CONFLICT) {
        return checkRoles;
      }

      if (checkRoles === true) {
        return {
          code: STATUS_CODE.CODE_CONFLICT,
          message: 'SORRY! THIS ROLES IS ALREADY EXISTING!',
          data: null
        };
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

      return {
        code: STATUS_CODE.CODE_CREATED,
        message: 'ROLES CREATED SUCCESSFULLY',
        data: savedRoles
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchAllRolesAction(): Promise<any> {
    try {
      const notDeleteRolesList = await rolesModel
        .find({
          'deleted_at.date': null
        })
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (!notDeleteRolesList || notDeleteRolesList?.length === 0) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'SORRY! ROLES LIST NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'ROLES FETCH SUCCESSFULLY',
        data: notDeleteRolesList
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchSingleRoleAction({ id, name }: IActionRoles['single_roles']): Promise<any> {
    try {
      const checkQuery: any = { 'deleted_at.date': null };
      if (isValidObjectId(id)) {
        checkQuery.$or = [{ _id: id }];
      }
      if (name) {
        checkQuery.$or = checkQuery.$or ? [...checkQuery.$or, { name }] : [{ name }];
      }
      const notDeleteSingleRole = await rolesModel
        .findOne(checkQuery)
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (!notDeleteSingleRole) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'SORRY! THIS ROLE NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'ROLE FETCHED SUCCESSFULLY',
        data: notDeleteSingleRole
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
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

      const updatedRoles = await rolesModel
        .findByIdAndUpdate(
          { _id: id, 'deleted_at.date': null },
          {
            $set: {
              name: name,
              description: description,
              access_control: accessControl
            }
          },
          { new: true }
        )
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (!updatedRoles) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'SORRY! THIS ROLES IS NOT UPDATE FAILED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'ROLE IS UPDATED SUCCESSFULLY',
        data: updatedRoles
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async updateStatusRoleAction({ id, status }: IActionRoles['update_status_roles']): Promise<any> {
    try {
      const checkRoleAction = await checkRecordFound({ _id: id });

      if (typeof checkRoleAction !== 'boolean') {
        return checkRoleAction;
      }

      const updatedStatusRoles = await rolesModel
        .findByIdAndUpdate(
          { _id: id, 'deleted_at.date': null },
          {
            $set: {
              is_active: status
            }
          },
          { new: true }
        )
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (!updatedStatusRoles) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'SORRY! THIS ROLES STATUS IS BEEN NOT UPDATED.',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'ROLE STATUS UPDATED SUCCESSFULLY',
        data: updatedStatusRoles
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async tempDeleteRoleAction({ id }: IActionRoles['temp_delete_roles']): Promise<any> {
    try {
      const rolesCheck = await checkRecordFound({ _id: id });

      if (typeof rolesCheck !== 'boolean') {
        return rolesCheck;
      }

      const deleteRolesAction = await rolesModel
        .findByIdAndUpdate(
          { _id: id, 'deleted_at.date': null },
          {
            $set: {
              'deleted_at.date': DateTimeUtils.getToday(),
              'deleted_at.user_id': null
            }
          },
          { new: true }
        )
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (!deleteRolesAction) {
        return {
          code: STATUS_CODE.CODE_CONFLICT,
          message: 'SORRY! THIS ROLE COULD NOT BE DELETED!',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'ROLE DELETE SUCCESSFULLY',
        data: deleteRolesAction
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
    }
  }

  async deleteRolesListAction() {
    try {
      const deleteRolesList = await rolesModel
        .find({
          'deleted_at.date': { $ne: null }
        })
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (!deleteRolesList || deleteRolesList?.length === 0) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'DELETE ROLES LIST NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'DELETE ROLES FETCH SUCCESSFULLY',
        data: deleteRolesList
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async restoreRoleAction({ id, name }: IActionRoles['roll_back_roles']): Promise<any> {
    try {
      const rolesCheckAction = await checkRecordFound({ _id: id, name: name });

      if (rolesCheckAction?.code !== STATUS_CODE.CODE_CONFLICT) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'ROLES NOT FOUND',
          data: null
        };
      }

      const rollbackRolesAction = await rolesModel
        .findByIdAndUpdate(
          { _id: id, name: name, 'deleted_at.date': { $ne: null } },
          {
            $set: {
              'deleted_at.date': null,
              'deleted_at.user_id': null
            }
          },
          { new: true }
        )
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (!rollbackRolesAction) {
        return {
          code: STATUS_CODE.CODE_CONFLICT,
          message: 'SORRY! THIS ROLES COULD NOT BE RESTORE!',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'ROLES RESTORE SUCCESSFULLY',
        data: rollbackRolesAction
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async permanentlyDeleteRoleAction({
    id,
    name
  }: IActionRoles['permanently_delete_roles']): Promise<any> {
    const rolesCheckAction = await checkRecordFound({ _id: id, name: name });

    if (rolesCheckAction === true || rolesCheckAction?.code !== 409) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'SORRY! THIS ROLES IS NOT FOUND!',
        data: null
      };
    }

    try {
      const rollbackRolesAction = await rolesModel
        .findOneAndDelete({
          _id: id,
          name: name,
          'deleted_at.date': { $ne: null }
        })
        .populate({
          path: 'access_control.permission_id',
          model: MODEL_COLLECTION_LIST.PERMISSION
        })
        .populate({
          path: 'access_control.feature_id',
          model: MODEL_COLLECTION_LIST.FEATURES
        });

      if (rollbackRolesAction) {
        return {
          code: STATUS_CODE.CODE_OK,
          message: 'ROLE PERMANENTLY DELETED SUCCESSFULLY',
          data: rollbackRolesAction
        };
      } else {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'SORRY! THIS ROLE HAS BEEN NOT DELETED!',
          data: null
        };
      }
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }
}

export default new RolesModelAction();
