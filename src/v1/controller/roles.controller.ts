import STATUS_CODE from '../../helper/statusCode';
import featuresAction from '../model/features/features-action';
import permissionsAction from '../model/permissions/permissions-action';
import RolesModelAction from '../model/roles/roles-action';
import { IActionRoles } from '../types/model/model-action';
import { ServerError, ServerResponse } from '../utils/response';

class RolesController {
  /**
   * REVIEW: The createPermission function is used to create a new permission.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param rolesData: `rolesData` is an object containing the information needed to create a new role.
   *
   */

  async createRoles(_parent: any, { rolesData }: { rolesData: IActionRoles['create_roles'] }) {
    const newRoles = {
      name: rolesData.name,
      description: rolesData.description,
      accessControl: rolesData.accessControl
    };

    const actionResponse = await RolesModelAction.createRolesAction(newRoles);

    if (actionResponse?.code !== STATUS_CODE.CODE_CREATED) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    } else {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    }
  }

  /**
   *
   * REVIEW: The updateRoles function is used to update an existing role.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param id: The ID of the role you want to update.
   * @param rolesData: `rolesData` is an object containing the information needed to create a new role.
   *
   */
  async updateRoles(
    _parent: any,
    { id, rolesData }: { id: string; rolesData: IActionRoles['update_roles'] }
  ) {
    const updateRolesData = {
      id: id,
      name: rolesData.name,
      description: rolesData.description,
      accessControl: rolesData.accessControl
    };

    const actionResponse = await RolesModelAction.updateRolesAction(updateRolesData);

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The fetchAllRoles function is used to fetch all roles data.
   *
   */
  async fetchAllRoles() {
    const actionResponse = await RolesModelAction.fetchAllRolesAction();
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The fetchSingleRole function is used to fetch data for a single role.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param id: The ID of the role you want to fetch.
   *
   */
  async fetchSingleRoles(_parent: any, { id, name }: { id: string; name: string }) {
    const actionResponse = await RolesModelAction.fetchSingleRoleAction({ id, name });
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The updateRoles function is used to update an existing role.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param id: The ID of the role you want to update.
   * @param status: `status` is an number the information needed to update a role.
   *
   */
  async updateStatusRoles(_parent: any, { id, status }: IActionRoles['update_status_roles']) {
    const updateRolesData = {
      id: id,
      status: status
    };

    const actionResponse = await RolesModelAction.updateStatusRoleAction(updateRolesData);

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The tempDeleteRoles function is used to temporarily delete a role.
   *
   */
  async fetchRoleAccessController() {
    const actionPermissionResponse = await permissionsAction.fetchAllPermissionsAction({
      'deleted_at.date': null,
      is_active: true
    });

    const actionFeatureResponse = await featuresAction.fetchAllFeaturesAction();

    if (!actionPermissionResponse && !actionFeatureResponse) {
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'SORRY! PERMISSION AND FEATURES NOT FOUND', {
        actionPermissionResponse,
        actionFeatureResponse
      });
    }

    const combineDataList = actionFeatureResponse?.data?.map((feature: any) => ({
      feature_id: feature,
      permission_id: actionPermissionResponse.data
    }));

    if (combineDataList?.length === 0) {
      return ServerError(
        STATUS_CODE.CODE_NOT_FOUND,
        'SORRY! PERMISSION AND FEATURES NOT FOUND',
        combineDataList
      );
    }

    return ServerResponse(
      STATUS_CODE.CODE_OK,
      'Roles Access control fetch successfully.',
      combineDataList
    );
  }

  /**
   *
   * REVIEW: The tempDeleteRoles function is used to temporarily delete a role.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param id: The ID of the role you want to temporarily delete.
   *
   */
  async tempDeleteRoles(_parent: any, { id }: { id: string }) {
    const actionResponse = await RolesModelAction.tempDeleteRoleAction({ id });

    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The deleteAllRoles function is used to restore all temporarily deleted roles.
   *
   */
  async deleteAllRoles() {
    const actionResponse = await RolesModelAction.deleteRolesListAction();
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The restoreRoles function is used to restore a specific deleted role.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param id: The unique identifier of the role to restore.
   * @param name: The name of the role to be restore.
   *
   */
  async restoreRoles(_parent: any, { id, name }: IActionRoles['roll_back_roles']) {
    const actionResponse = await RolesModelAction.restoreRoleAction({ id, name });

    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The permanentlyDeleteRoles function is used to permanently delete records that were temporarily deleted.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The unique identifier of the role(s) to permanently delete.
   * @param name: The name of the role(s) to be permanently deleted.
   *
   * @returns The result of the deletion process or an error if the operation fails.
   *
   */
  async permanentlyDeleteRoles(
    _parent: any,
    { id, name }: IActionRoles['permanently_delete_roles']
  ) {
    const actionResponse = await RolesModelAction.permanentlyDeleteRoleAction({ id, name });

    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }
}

export const rolesController = new RolesController();
