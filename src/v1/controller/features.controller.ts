import STATUS_CODE from '../../helper/statusCode';
import FeatureModelAction from '../model/features/features-action';
import { IActionFeature } from '../types/model/model-action';
import { ServerError, ServerResponse } from '../utils/response';

class FeaturesController {
  /**
   *
   * REVIEW: The fetchAllFeature function retrieves a list of all features that have not been deleted.
   *
   */
  async fetchAllFeatures(_parent: any, { status }: { status: number }) {
    const actionResponse = await FeatureModelAction.fetchAllFeaturesAction({
      status
    });
    return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The fetchSingleFeature function retrieves a single feature by its ID.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The ID of the feature you want to fetch.
   *
   */
  async fetchSingleFeature(_parent: any, { id }: IActionFeature['single_feature']) {
    const actionResponse = await FeatureModelAction.fetchSingleFeatureAction({ id });
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  /**
   *
   * REVIEW: The createFeatures function is used to create a new feature.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param featureData: `featureData` is an object containing the information needed to create a new feature.
   *
   */
  async createFeature(
    _parent: any,
    { featureData }: { featureData: IActionFeature['create_feature'] }
  ) {
    const newFeature = {
      name: featureData.name,
      description: featureData.description
    };

    const actionResponse = await FeatureModelAction.createFeatureAction(newFeature);

    if (actionResponse?.status === STATUS_CODE.CODE_CREATED) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  /**
   *
   * REVIEW: The updateFeature function updates an existing feature.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers
   * @param featureData: `featureData` is an object containing the information needed to update a new feature.
   *
   */
  async updateFeature(
    _parent: any,
    { id, featureData }: { id: string; featureData: IActionFeature['update_feature'] }
  ) {
    const updateFeatureData = {
      id: id,
      name: featureData.name,
      description: featureData.description
    };
    const actionResponse = await FeatureModelAction.updateFeaturesAction(updateFeatureData);
    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }

  /**
   *
   * REVIEW: permanentlyDeleteFeature function is used to undo the deletion of a specific feature by restoring it.
   *
   * @param _parent: The `_parent` parameter is typically unused in most resolvers.
   * @param id: The unique identifier of the feature to permanently delete.
   * @param name: The name of the feature to be permanently deleted.
   *
   * @returns The result of the deletion process or an error if the operation fails.
   *
   */
  async permanentlyDeleteFeature(
    _parent: any,
    { id, name }: IActionFeature['permanently_delete_feature']
  ) {
    const actionResponse = await FeatureModelAction.permanentlyDeleteFeatureAction({ id, name });

    if (actionResponse?.status === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.status, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.status, actionResponse?.message, actionResponse?.error);
    }
  }
}

export const featuresController = new FeaturesController();
