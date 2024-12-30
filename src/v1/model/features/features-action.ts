import STATUS_CODE from '../../../helper/statusCode';
import { IActionFeature } from '../../types/model/model-action';
import { featureModel } from './features';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const features = await featureModel.findOne(checkData);

    if (features === null) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'FEATURES NOT FOUND',
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

class FeatureModelAction {
  async createFeatureAction({ name, description }: IActionFeature['create_feature']): Promise<any> {
    try {
      const newFeature = new featureModel({
        name: name,
        description: description
      });

      const savedFeature = await newFeature.save();
      return {
        code: STATUS_CODE.CODE_CREATED,
        message: 'Feature CREATED SUCCESSFULLY',
        data: savedFeature
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchAllFeaturesAction(): Promise<any> {
    try {
      const featuresList = await featureModel.find({
        'deleted_at.date': null
      });

      if (!featuresList || featuresList?.length === 0) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'FEATURES LIST NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'FEATURES FETCH SUCCESSFULLY',
        data: featuresList
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchSingleFeatureAction({ id }: IActionFeature['single_feature']): Promise<any> {
    try {
      const singleFeature = await featureModel.findOne({ _id: id });

      if (!singleFeature) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'FEATURES NOT FOUND OR ALREADY DELETED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'FEATURES FETCHED SUCCESSFULLY',
        data: singleFeature
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
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

      if (!updatedFeature) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'FEATURES NOT FOUND OR UPDATE FAILED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'FEATURES UPDATED SUCCESSFULLY',
        data: updatedFeature
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async permanentlyDeleteFeatureAction({
    id,
    name
  }: IActionFeature['permanently_delete_feature']): Promise<any> {
    const featuresCheck = await checkRecordFound({ _id: id, name: name });

    if (featuresCheck !== true) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'SORRY! THIS FEATURE IS NOT FOUND!',
        data: null
      };
    }

    try {
      const rollbackFeaturesAction = await featureModel.findOneAndDelete({
        _id: id,
        name: name
      });

      if (rollbackFeaturesAction) {
        return {
          code: STATUS_CODE.CODE_OK,
          message: 'FEATURE PERMANENTLY DELETED SUCCESSFULLY',
          data: rollbackFeaturesAction
        };
      } else {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'SORRY! THIS FEATURE HAS BEEN NOT DELETED!',
          data: null
        };
      }
    } catch (error: any) {
      return {
        code: STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: 'Error while rolling back feature',
        error: error
      };
    }
  }
}

export default new FeatureModelAction();
