import mongoose from 'mongoose';
import STATUS_CODE from '../../../helper/statusCode';
import { IActionUserTag } from '../../types/model/model-action';
import { ServerError, ServerResponse } from '../../utils/response';
import { userTagsModel } from './user-tags';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const checkRecordResult = await userTagsModel.findOne(checkData);

    if (checkRecordResult === null) {
      return {
        status: STATUS_CODE.CODE_NOT_FOUND,
        message: 'DEPARTMENT NOT FOUND',
        data: null
      };
    }

    return true;
  } catch (error: any) {
    return {
      status: error?.errorResponse?.code,
      message: error?.errorResponse?.errmsg,
      error: error
    };
  }
};

class UserTagsModelAction {
  async fetchAllUseTagAction(): Promise<any> {
    try {
      const userTagsList = await userTagsModel.aggregate([
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
      ]);

      if (userTagsList) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'USER TAGS FETCH SUCCESSFULLY', userTagsList);
      } else {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'USER TAGS LIST NOT FOUND', null);
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async fetchSingleUserTagAction({ id }: IActionUserTag['single_user_tag']): Promise<any> {
    try {
      const singleUserTag = await userTagsModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
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
      ]);

      if (singleUserTag) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'USER TAG FETCHED SUCCESSFULLY', singleUserTag);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'USER TAG NOT FOUND OR ALREADY DELETED',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

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

      if (savedNewRecord) {
        return ServerResponse(STATUS_CODE.CODE_CREATED, 'USER TAG CREATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'Sorry! This user tag is not created. Please try again.',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
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

      if (updatedUserTag) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'USER TAG UPDATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_MODIFIED,
          'USER TAG NOT FOUND OR UPDATE FAILED',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async updateStatusUserTagAction({
    id,
    status
  }: IActionUserTag['update_status_user_tag']): Promise<any> {
    try {
      const checkRecordOnDatabase = await checkRecordFound({ _id: id, is_active: !status });

      if (typeof checkRecordOnDatabase !== 'boolean') {
        return checkRecordOnDatabase;
      }

      const updatedStatusUserTag = await userTagsModel.findByIdAndUpdate(
        { _id: id, is_active: !status },
        {
          $set: {
            is_active: status
          }
        },
        { new: true }
      );

      if (updatedStatusUserTag) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'USER TAG STATUS UPDATED SUCCESSFULLY', true);
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_MODIFIED,
          'SORRY! THIS USER TAG STATUS IS BEEN NOT UPDATED.',
          false
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }

  async permanentlyDeleteUserTagAction({
    id,
    name
  }: IActionUserTag['permanently_delete_user_tag']): Promise<any> {
    const checkRecordOnDatabase = await checkRecordFound({ _id: id, name: name });

    if (checkRecordOnDatabase === false) {
      return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'SORRY! THIS DEPARTMENT IS NOT FOUND!', null);
    }

    try {
      const deleteActionResult = await userTagsModel.findOneAndDelete({
        _id: id,
        name: name
      });

      if (deleteActionResult) {
        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'USER TAG PERMANENTLY DELETED SUCCESSFULLY',
          true
        );
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'SORRY! THIS USER TAG HAS BEEN NOT DELETED!',
          null
        );
      }
    } catch (error: any) {
      return ServerError(error?.errorResponse?.code, error?.errorResponse?.errmsg, error);
    }
  }
}

export default new UserTagsModelAction();
