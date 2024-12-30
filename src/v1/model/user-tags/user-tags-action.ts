import STATUS_CODE from '../../../helper/statusCode';
import { IActionUserTag } from '../../types/model/model-action';
import { userTagsModel } from './user-tags';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const checkRecordResult = await userTagsModel.findOne(checkData);

    if (checkRecordResult === null) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'DEPARTMENT NOT FOUND',
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

class UserTagsModelAction {
  async createUserTagAction({
    name,
    description
  }: IActionUserTag['create_user_tag']): Promise<any> {
    try {
      const newRecord = new userTagsModel({
        name: name,
        description: description
      });

      const savedNewRecord = await newRecord.save();
      return {
        code: STATUS_CODE.CODE_CREATED,
        message: 'USER TAG CREATED SUCCESSFULLY',
        data: savedNewRecord
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchAllUseTagAction(): Promise<any> {
    try {
      const userTagsList = await userTagsModel.find();

      if (!userTagsList || userTagsList?.length === 0) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'USER TAGS LIST NOT FOUND',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'USER TAGS FETCH SUCCESSFULLY',
        data: userTagsList
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async fetchSingleUserTagAction({ id }: IActionUserTag['single_user_tag']): Promise<any> {
    try {
      const singleUserTag = await userTagsModel.findOne({
        _id: id
      });

      if (!singleUserTag) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'USER TAG NOT FOUND OR ALREADY DELETED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'USER TAG FETCHED SUCCESSFULLY',
        data: singleUserTag
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'AN ERROR OCCURRED',
        error: error
      };
    }
  }

  async updateUserTagAction({
    id,
    name,
    description
  }: IActionUserTag['update_user_tag']): Promise<any> {
    try {
      const checkRecordOnDatabase = await checkRecordFound({ _id: id });

      if (typeof checkRecordOnDatabase !== 'boolean') {
        return checkRecordOnDatabase;
      }

      const updatedUserTag = await userTagsModel.findByIdAndUpdate(
        { _id: id },
        { name, description },
        { new: true }
      );

      if (!updatedUserTag) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'USER TAG NOT FOUND OR UPDATE FAILED',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'USER TAG UPDATED SUCCESSFULLY',
        data: updatedUserTag
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async updateStatusUserTagAction({
    id,
    status
  }: IActionUserTag['update_status_user_tag']): Promise<any> {
    try {
      const checkRecordOnDatabse = await checkRecordFound({ _id: id });

      if (typeof checkRecordOnDatabse !== 'boolean') {
        return checkRecordOnDatabse;
      }

      const updatedStatusUserTag = await userTagsModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            is_active: status
          }
        },
        { new: true }
      );

      if (!updatedStatusUserTag) {
        return {
          code: STATUS_CODE.CODE_NOT_MODIFIED,
          message: 'SORRY! THIS USER TAG STATUS IS BEEN NOT UPDATED.',
          data: null
        };
      }

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'USER TAG STATUS UPDATED SUCCESSFULLY',
        data: updatedStatusUserTag
      };
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async permanentlyDeleteUserTagAction({
    id,
    name
  }: IActionUserTag['permanently_delete_user_tag']): Promise<any> {
    const checkRecordOnDatabase = await checkRecordFound({ _id: id, name: name });

    if (checkRecordOnDatabase === false) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'SORRY! THIS DEPARTMENT IS NOT FOUND!',
        data: null
      };
    }

    try {
      const deleteActionResult = await userTagsModel.findOneAndDelete({
        _id: id,
        name: name
      });

      if (deleteActionResult) {
        return {
          code: STATUS_CODE.CODE_OK,
          message: 'USER TAG PERMANENTLY DELETED SUCCESSFULLY',
          data: deleteActionResult
        };
      } else {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'SORRY! THIS USER TAG HAS BEEN NOT DELETED!',
          data: null
        };
      }
    } catch (error: any) {
      return {
        code: STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: 'ERROR: UNABLE TO DELETE USER TAG. PLEASE TRY AGAIN.',
        error: error
      };
    }
  }
}

export default new UserTagsModelAction();
