import { featuresController } from '../../controller';

export default {
  Query: {
    featuresList: featuresController.fetchAllFeatures,
    singleFeature: featuresController.fetchSingleFeature
  },
  Mutation: {
    createFeature: featuresController.createFeature,
    updateFeature: featuresController.updateFeature,
    permanentlyDeleteFeature: featuresController.permanentlyDeleteFeature
  }
};
