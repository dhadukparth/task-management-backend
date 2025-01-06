import mongoose from 'mongoose';
import STATUS_CODE from '../../../helper/statusCode';
import { IActionFeature } from '../../types/model/model-action';
import { ServerError, ServerResponse } from '../../utils/response';
import { featureModel } from './features';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const features = await featureModel.findOne(checkData);

    if (features === null) {
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'FEATURES NOT FOUND', null);
    }

    return true;
  } catch (error: any) {
    return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
  }
};

const featurePipeline = [
  {
    $addFields: {
      created_at: {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
        }
      }
    }
  }
];

class FeatureModelAction {
  /**
   *
   * @param status: passing number indicating  1: not deleted, 2: deleted
   *
   */
  async fetchAllFeaturesAction({ status }: { status: number }): Promise<any> {
    try {
      const featuresList = await featureModel.aggregate([
        ...featurePipeline,
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      if (featuresList?.length) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'FEATURES FETCH SUCCESSFULLY', featuresList);
      }
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'FEATURES LIST NOT FOUND', null);
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async fetchSingleFeatureAction({ id }: IActionFeature['single_feature']): Promise<any> {
    try {
      // const singleFeature = await featureModel.findOne({ _id: id });
      const singleFeature = await featureModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        ...featurePipeline
      ]);

      if (singleFeature) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'FEATURES FETCHED SUCCESSFULLY',
          singleFeature[0]
        );
      }

      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'FEATURES NOT FOUND OR ALREADY DELETED', null);
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async createFeatureAction({ name, description }: IActionFeature['create_feature']): Promise<any> {
    try {
      const newFeature = new featureModel({
        name: name,
        description: description
      });

      const savedFeature = await newFeature.save();
      if (savedFeature) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'Feature CREATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'Sorry! This feature is not created, Please try again.',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updateFeaturesAction({
    id,
    name,
    description
  }: IActionFeature['update_feature']): Promise<any> {
    try {
      const featureCheck = await checkRecordFound({ _id: id });

      if (typeof featureCheck !== 'boolean') {
        return featureCheck;
      }

      const updatedFeature = await featureModel.findByIdAndUpdate(
        { _id: id },
        { name, description },
        { new: true }
      );

      if (updatedFeature) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'FEATURES UPDATED SUCCESSFULLY', true);
      }

      return ServerError(
        STATUS_CODE.CODE_NOT_MODIFIED,
        'FEATURES NOT FOUND OR UPDATE FAILED',
        null
      );
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async permanentlyDeleteFeatureAction({
    id,
    name
  }: IActionFeature['permanently_delete_feature']): Promise<any> {
    try {
      const featuresCheck = await checkRecordFound({ _id: id, name: name });

      if (featuresCheck !== true) {
        return featuresCheck;
      }

      const rollbackFeaturesAction = await featureModel.findOneAndDelete({
        _id: id,
        name: name
      });

      if (rollbackFeaturesAction) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'FEATURE PERMANENTLY DELETED SUCCESSFULLY',
          true
        );
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'SORRY! THIS FEATURE HAS BEEN NOT DELETED!',
          null
        );
      }
    } catch (error: any) {
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Error while rolling back feature',
        error
      );
    }
  }
}

export default new FeatureModelAction();
