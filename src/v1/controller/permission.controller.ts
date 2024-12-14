import STATUS_CODE from '../../helper/statusCode';
import PermissionModelAction from '../model/permissions/permissions-action';
import { IActionPermission } from '../types/model/model-action';
import { ServerError, ServerResponse } from '../utils/response';

class PermissionController {
  /**
   *
   * REVIEW: The createPermission function is used to create a new permission.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param permissionData: `permissionData` is an object containing the information needed to create a new permission.
   *
   */
  async createPermission(
    _parent: any,
    { permissionData }: { permissionData: IActionPermission['create_permission'] }
  ) {
    const newPermission = {
      name: permissionData.name,
      description: permissionData.description
    };

    const actionResponse = await PermissionModelAction.createPermissionAction(newPermission);

    if (actionResponse?.code !== STATUS_CODE.CODE_CREATED) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    } else {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    }
  }

  /**
   *
   * REVIEW: The updatePermission function updates an existing permission.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param permissionData: `permissionData` is an object containing the information needed to update a new permission.
   *
   */
  async updatePermission(
    _parent: any,
    { id, permissionData }: { id: string; permissionData: IActionPermission['update_permission'] }
  ) {
    const updatePermissionData = {
      id: id,
      name: permissionData.name,
      description: permissionData.description
    };
    const actionResponse = await PermissionModelAction.updatePermissionAction(updatePermissionData);
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The fetchAllPermission function retrieves a list of all permissions that have not been deleted.
   *
   */
  async fetchAllPermission() {
    const actionResponse = await PermissionModelAction.fetchAllPermissionsAction();
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The fetchSinglePermission function retrieves a single permission by its ID.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The ID of the permission you want to fetch.
   *
   */
  async fetchSinglePermission(_parent: any, { id }: IActionPermission['single_permission']) {
    const actionResponse = await PermissionModelAction.fetchSinglePermissionAction({ id });
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
  async updateStatusPermission(
    _parent: any,
    { id, status }: IActionPermission['update_status_permission']
  ) {
    const updatePermissionData = {
      id: id,
      status: status
    };

    const actionResponse =
      await PermissionModelAction.updateStatusPermissionAction(updatePermissionData);

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The deletePermission function marks a permission as deleted.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The ID of the role you want to temporarily delete.
   *
   */
  async tempDeletePermission(_parent: any, { id }: IActionPermission['temp_delete_permission']) {
    const actionResponse = await PermissionModelAction.tempDeletePermissionAction({ id });
    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: rollBackAllPermission function is used to rollback all permissions to their previous state.
   *
   */
  async rollBackAllPermission() {
    const actionResponse = await PermissionModelAction.rollBackAllPermissionsAction();
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: rollbackPermission function is used to rollback a specific permission to its previous state.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param id: The unique identifier of the permission to restore.
   * @param name: The name of the permission to be restore.
   *
   * @returns The result of the deletion process or an error if the operation fails.
   *
   */
  async rollbackPermission(_parent: any, { id, name }: IActionPermission['roll_back_permission']) {
    const actionResponse = await PermissionModelAction.rollbackPermissionAction({ id, name });

    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: rollbackDeletePermission function is used to undo the deletion of a specific permission by restoring it.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The unique identifier of the permission to permanently delete.
   * @param name: The name of the permission to be permanently deleted.
   *
   * @returns The result of the deletion process or an error if the operation fails.
   *
   */
  async rollbackDeletePermission(
    _parent: any,
    { id, name }: IActionPermission['roll_back_delete_permission']
  ) {
    const actionResponse = await PermissionModelAction.rollbackDeletePermissionAction({ id, name });

    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }
}

export const permissionController = new PermissionController();
