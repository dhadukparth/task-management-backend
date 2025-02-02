import { mediaController } from '../../controller';

export default {
  Query: {
    getAllMedia: mediaController.getAllMediaFeature,
    getSingleMedia: mediaController.getSingleMediaFeature
  },
  Mutation: {
    singleUploadMedia: mediaController.uploadSingleMediaFeature,
    deleteMedia: mediaController.deleteMediaFeature
  }
};
