import { userTagController } from '../../controller';

export default {
  Query: {
    getAllUserTags: userTagController.fetchAllUserTags,
    getSingleUserTag: userTagController.fetchSingleUserTag
  },
  Mutation: {
    createUserTag: userTagController.createUserTag,
    updateUserTag: userTagController.updateUserTag,
    updateStatusUserTag: userTagController.updateStatusUserTag,
    deletePermanentlyUserTag: userTagController.deletePermanentlyUserTag
  }
};
