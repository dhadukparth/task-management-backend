import { GraphQLUpload } from 'graphql-upload-ts';
import { mediaController } from '../../controller';

export default {
  Upload: GraphQLUpload,
  Query: {
    getAllMedia: mediaController.getAllMediaFeature,
    getSingleMedia: mediaController.getSingleMediaFeature
  },
  Mutation: {
    singleUploadMedia: mediaController.uploadMediaFeature,
    deleteMedia: mediaController.deleteMediaFeature
  }
};
