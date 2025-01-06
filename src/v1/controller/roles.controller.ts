import STATUS_CODE from '../../helper/statusCode';
import featuresAction from '../model/features/features-action';
import permissionsAction from '../model/permissions/permissions-action';
import RolesModelAction from '../model/roles/roles-action';
import { IActionRoles } from '../types/model/model-action';
import { ServerError, ServerResponse } from '../utils/response';

class RolesController {
  /**
   *
   * REVIEW: The fetchAllRoles function is used to fetch all roles data.
   *
   */
  async fetchAllRoles(_parent: any, { status }: { status: number }) {
    const actionResponse = await RolesModelAction.fetchAllRolesAction({ status });
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
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
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

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

    if (actionResponse?.status === STATUS_CODE.CODE_CREATED) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
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

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
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

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
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

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
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

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
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

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }
}

export const rolesController = new RolesController();
