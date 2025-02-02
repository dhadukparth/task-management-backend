import fs from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import mongoose from 'mongoose';
import path from 'path';
import STATUS_CODE from '../../../helper/statusCode';
import { mediaPipelines } from '../../Pipelines';
import ApolloFileUpload from '../../services/upload';
import { IActionMedia } from '../../types/model/model-action';
import { ServerError, ServerResponse } from '../../utils/response';
import { MediaModel } from './media';

class MediaModelAction {
  async uploadMediaFeatureAction(
    uploadFile: FileUpload,
    args: IActionMedia['upload_file']
  ): Promise<any> {
    try {
      const isExiting = await MediaModel.aggregate([
        {
          $match: {
            name: args.name
          }
        }
      ]);

      if (isExiting.length) {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry!, This file name is already exiting, please change name then upload again',
          null
        );
      }

      const uploadFileResponse: any = await ApolloFileUpload(args.fileType, uploadFile, args.name);

      const newMedia = new MediaModel({
        name: args.name,
        description: args.description,
        fileType: args.fileType,
        file: {
          fileName: uploadFileResponse.fileName,
          filePath: uploadFileResponse.filePath
        }
      });

      const savedMediaResponse = await newMedia.save();
      if (savedMediaResponse) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'File Upload Successfully', {
          fileId: savedMediaResponse._id,
          fileName: savedMediaResponse.file.fileName
        });
      } else {
        const filePath = path.join(process.cwd(), uploadFileResponse.filePath);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return ServerError(
          STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
          'Sorry!, This file is not uploaded, Please try again.',
          null
        );
      }
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async getAllMediaFeatureAction() {
    try {
      const allMediaFiles = await MediaModel.aggregate([
        ...mediaPipelines.media_pipelines,
        {
          $sort: {
            created_at: -1
          }
        }
      ]);

      return ServerResponse(STATUS_CODE.CODE_OK, 'FETCH ALL MEDIA FILES', allMediaFiles);
    } catch (error: any) {
      console.error('Error fetching media:', error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'An error occurred while fetching media.',
        error.message
      );
    }
  }

  async getSingleMediaFeatureAction(args: IActionMedia['single_file']) {
    try {
      const isExiting = await MediaModel.aggregate([
        {
          $match: {
            $or: [{ _id: args.id }, { name: args.name }]
          }
        },
        ...mediaPipelines.media_pipelines
      ]);

      if (isExiting.length) {
        return ServerResponse(STATUS_CODE.CODE_OK, 'Single file fetch successfully', isExiting[0]);
      } else {
        return ServerError(
          STATUS_CODE.CODE_CONFLICT,
          'Sorry!, This file is not found, please check your data',
          null
        );
      }
    } catch (error: any) {
      console.error('Error fetching media:', error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'An error occurred while fetching media.',
        error.message
      );
    }
  }

  async deleteMediaFeatureAction(args: IActionMedia['single_file']) {
    try {
      const isExiting = await MediaModel.aggregate([
        {
          $match: {
            $and: [
              {
                _id: new mongoose.Types.ObjectId(args.id)
              },
              { name: args.name }
            ]
          }
        }
      ]);

      if (!isExiting.length) {
        return ServerError(STATUS_CODE.CODE_NOT_FOUND, 'Sorry!, This file is not found', null);
      }

      const filePath = path.join(process.cwd(), isExiting?.[0]?.file.filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        await MediaModel.deleteOne({ _id: args.id });

        return ServerResponse(
          STATUS_CODE.CODE_OK,
          'Media file and record deleted successfully.',
          true
        );
      } else {
        return ServerError(
          STATUS_CODE.CODE_NOT_FOUND,
          'Sorry! This file is not found that directory.',
          null
        );
      }
    } catch (error: any) {
      console.error('Error fetching media:', error);
      return ServerError(
        error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        error?.errorResponse?.errmsg || 'An error occurred while fetching media.',
        error.message
      );
    }
  }
}

export default new MediaModelAction();
