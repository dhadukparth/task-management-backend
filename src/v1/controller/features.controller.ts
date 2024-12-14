import STATUS_CODE from '../../helper/statusCode';
import FeatureModelAction from '../model/features/features-action';
import { IActionFeature } from '../types/model/model-action';
import { ServerError, ServerResponse } from '../utils/response';

class FeaturesController {
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

    if (actionResponse?.code !== STATUS_CODE.CODE_CREATED) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    } else {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
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
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }

  /**
   *
   * REVIEW: The fetchAllFeature function retrieves a list of all features that have not been deleted.
   *
   */
  async fetchAllFeatures() {
    const actionResponse = await FeatureModelAction.fetchAllFeaturesAction();
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
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
    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
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

    if (actionResponse?.code !== 200 || actionResponse?.code !== 409) {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }

    return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
  }
}

export const featuresController = new FeaturesController();
