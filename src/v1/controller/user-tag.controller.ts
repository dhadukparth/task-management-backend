import STATUS_CODE from '../../helper/statusCode';
import UserTagModelAction from '../model/user-tags/user-tags-action';
import { IActionUserTag } from '../types/model/model-action';
import { ServerError, ServerResponse } from '../utils/response';

class UserTagController {
  /**
   *
   * REVIEW: The createUserTag function is used to create a new user tag.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param userTagData: `userTagData` is an object containing the information needed to create a new user tag.
   *
   */
  async createUserTag(
    _parent: any,
    { userTagData }: { userTagData: IActionUserTag['create_user_tag'] }
  ) {
    const newRecordData = {
      name: userTagData.name,
      description: userTagData.description
    };

    const actionResponse = await UserTagModelAction.createUserTagAction(newRecordData);

    if (actionResponse?.code !== STATUS_CODE.CODE_CREATED) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    } else {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    }
  }

  /**
   *
   * REVIEW: The fetchAllUserTags function retrieves a list of all user tags that have not been deleted.
   *
   */
  async fetchAllUserTags() {
    const actionResponse = await UserTagModelAction.fetchAllUseTagAction();
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The fetchSingleUserTag function retrieves a single user tag by its ID.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The ID of the user tag you want to fetch.
   *
   */
  async fetchSingleUserTag(_parent: any, { id }: IActionUserTag['single_user_tag']) {
    const actionResponse = await UserTagModelAction.fetchSingleUserTagAction({ id });
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The updateUserTag function updates an existing user tag.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param userTagData: `userTagData` is an object containing the information needed to update a new user tag.
   *
   */
  async updateUserTag(
    _parent: any,
    { id, userTagData }: { id: string; userTagData: IActionUserTag['update_user_tag'] }
  ) {
    const updateRecordData = {
      id: id,
      name: userTagData.name,
      description: userTagData.description
    };
    const actionResponse = await UserTagModelAction.updateUserTagAction(updateRecordData);
    if (actionResponse?.code === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    }
  }

  /**
   *
   * REVIEW: The updateStatusUserTag function is used solely to update the status of a user tag record.
   *
   * @param _parent - Unused parameter, generally required in GraphQL resolver function signatures.
   * @param id - The ID of the user tag to update.
   * @param status - The new status of the user tag, represented as a number.
   * @returns - Returns a successful server response if the update is completed successfully, or an error response if the update fails.
   *
   */
  async updateStatusUserTag(
    _parent: any,
    { id, status }: IActionUserTag['update_status_user_tag']
  ) {
    const updateStatusRecordData = {
      id: id,
      status: status
    };

    const actionResponse =
      await UserTagModelAction.updateStatusUserTagAction(updateStatusRecordData);
    if (actionResponse?.code === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    }
  }

  /**
   *
   * REVIEW: deletePermanentlyUserTag function is used to undo the deletion of a specific user tag by restoring it.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The unique identifier of the user tag to permanently delete.
   * @param name: The name of the user tag to be permanently deleted.
   *
   * @returns The result of the deletion process or an error if the operation fails.
   *
   */
  async deletePermanentlyUserTag(
    _parent: any,
    { id, name }: IActionUserTag['permanently_delete_user_tag']
  ) {
    const actionResponse = await UserTagModelAction.permanentlyDeleteUserTagAction({
      id,
      name
    });

    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }
}

export const userTagController = new UserTagController();
