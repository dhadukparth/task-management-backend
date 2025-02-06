import STATUS_CODE from '../../helper/statusCode';
import DepartmentModelAction from '../model/department/department-action';
import { IActionDepartment } from '../types/model/model-action';
import { ServerError } from '../utils/response';

class DepartmentController {
  /**
   *
   * REVIEW: The fetchAllDepartment function retrieves a list of all departments that have not been deleted.
   *
   */
  async fetchAllDepartment(_parent: any, data: any, context: any) {
    const loginUser = await context.req.user;
    if (loginUser) {
      const actionResponse = await DepartmentModelAction.fetchAllDepartmentAction();
      return actionResponse;
    } else {
      console.log(context);
      context.res?.http?.status(STATUS_CODE.CODE_UNAUTHORIZED);
      return ServerError(
        STATUS_CODE.CODE_UNAUTHORIZED,
        'Sorry!, User has been authenticated.',
        null
      );
    }
  }

  /**
   *
   * REVIEW: The fetchSingleDepartment function retrieves a single department by its ID.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The ID of the department you want to fetch.
   *
   */
  async fetchSingleDepartment(_parent: any, { id }: IActionDepartment['single_department']) {
    const actionResponse = await DepartmentModelAction.fetchSingleDepartmentAction({ id });
    return actionResponse;
  }

  /**
   *
   * REVIEW: The createDepartment function is used to create a new department.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param departmentData: `departmentData` is an object containing the information needed to create a new department.
   *
   */
  async createDepartment(
    _parent: any,
    { departmentData }: { departmentData: IActionDepartment['create_department'] }
  ) {
    const newDepartment = {
      name: departmentData.name,
      description: departmentData.description
    };

    const actionResponse = await DepartmentModelAction.createDepartmentAction(newDepartment);
    return actionResponse;
  }

  /**
   *
   * REVIEW: The updateDepartment function updates an existing department.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param departmentData: `departmentData` is an object containing the information needed to update a new department.
   *
   */
  async updateDepartment(
    _parent: any,
    { id, departmentData }: { id: string; departmentData: IActionDepartment['update_department'] }
  ) {
    const updateDepartmentData = {
      id: id,
      name: departmentData.name,
      description: departmentData.description
    };
    const actionResponse = await DepartmentModelAction.updateDepartmentAction(updateDepartmentData);
    return actionResponse;
  }

  /**
   *
   * REVIEW: The `updateStatusDepartment` function is used solely to update the status of a department record.
   *
   * @param _parent - Unused parameter, generally required in GraphQL resolver function signatures.
   * @param id - The ID of the department to update.
   * @param status - The new status of the department, represented as a number.
   * @returns - Returns a successful server response if the update is completed successfully, or an error response if the update fails.
   *
   */
  async updateStatusDepartment(
    _parent: any,
    { id, status }: IActionDepartment['update_status_department']
  ) {
    const updateDepartmentData = {
      id: id,
      status: status
    };

    const actionResponse =
      await DepartmentModelAction.updateStatusDepartmentAction(updateDepartmentData);

    return actionResponse;
  }

  /**
   *
   * REVIEW: rollbackDeletePermission function is used to undo the deletion of a specific department by restoring it.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The unique identifier of the department to permanently delete.
   * @param name: The name of the department to be permanently deleted.
   *
   * @returns The result of the deletion process or an error if the operation fails.
   *
   */
  async deletePermanentlyDepartment(
    _parent: any,
    { id, name }: IActionDepartment['permanently_delete_department']
  ) {
    const actionResponse = await DepartmentModelAction.permanentlyDeleteDepartmentAction({
      id,
      name
    });
    return actionResponse;
  }
}

export const departmentController = new DepartmentController();
