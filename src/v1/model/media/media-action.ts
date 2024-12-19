import fs from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import path from 'path';
import ENVIRONMENT_VARIABLES from '../../../config/env.config';
import STATUS_CODE from '../../../helper/statusCode';
import ApolloFileUpload from '../../services/upload';
import { IActionMedia } from '../../types/model/model-action';
import { MediaModel } from './media';
import { FILE_UPLOAD_PATH } from '../../constant';

const checkRecordFound = async (checkData: any): Promise<any> => {
  try {
    const checkRecord = await MediaModel.findOne(checkData);

    if (checkRecord === null) {
      return {
        code: STATUS_CODE.CODE_NOT_FOUND,
        message: 'MEDIA NOT FOUND',
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

class MediaModelAction {
  async uploadMediaFeatureAction(
    uploadFile: FileUpload,
    args: IActionMedia['upload_file']
  ): Promise<any> {
    try {
      const checkRecordRecord = await checkRecordFound({ name: args.name });

      if (checkRecordRecord?.code === STATUS_CODE.CODE_NOT_FOUND) {
        const uploadFileResponse: any = await ApolloFileUpload(args.fileType, uploadFile);

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
          return {
            code: STATUS_CODE.CODE_OK,
            message: 'File Upload Successfully',
            data: savedMediaResponse
          };
        } else {
          const filePath = path.join(process.cwd(), uploadFileResponse.filePath);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } else {
        return {
          code: STATUS_CODE.CODE_CONFLICT,
          message: 'Sorry! This name already exists.'
        };
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
      const allMediaFiles = await MediaModel.find();

      if (!allMediaFiles.length) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'No media found',
          data: null
        };
      }

      const convertMediaFiles = allMediaFiles.map((data) => ({
        ...data.toObject(),
        file: {
          ...data.file,
          filePath: data.file.filePath
            ? `${ENVIRONMENT_VARIABLES.NODE_BACKEND_URL}${FILE_UPLOAD_PATH.GET_IMAGES}/${data.file.fileName}`
            : data.file.filePath
        }
      }));

      return {
        code: STATUS_CODE.CODE_OK,
        message: 'FETCH ALL MEDIA FILES',
        data: convertMediaFiles
      };
    } catch (error: any) {
      console.error('Error fetching media:', error);
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'An error occurred while fetching media.',
        error: error.message
      };
    }
  }

  async getSingleMediaFeatureAction(args: IActionMedia['single_file']) {
    try {
      const checkRecordRecord = await checkRecordFound({
        $or: [{ _id: args.id }, { name: args.name }]
      });

      if (checkRecordRecord) {
        const fetchRecord = await MediaModel.findOne({ _id: args.id, name: args.name });

        if (fetchRecord) {
          const fetchSingleFile = {
            ...fetchRecord.toObject(),
            file: {
              ...fetchRecord.file,
              filePath: fetchRecord.file.fileName
                ? `${ENVIRONMENT_VARIABLES.NODE_BACKEND_URL}${FILE_UPLOAD_PATH.GET_IMAGES}/${fetchRecord.file.fileName}`
                : fetchRecord.file.filePath
            }
          };

          return {
            code: STATUS_CODE.CODE_OK,
            message: 'SINGLE MEDIA FILE FETCH SUCCESSFULLY',
            data: fetchSingleFile
          };
        } else {
          return {
            code: STATUS_CODE.CODE_NOT_FOUND,
            message: 'Sorry! This file is not found',
            data: null
          };
        }
      } else {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'Sorry! This file is not found',
          data: null
        };
      }
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code,
        message: error?.errorResponse?.errmsg,
        error: error
      };
    }
  }

  async deleteMediaFeatureAction(args: IActionMedia['single_file']) {
    try {
      const recordToDelete = await MediaModel.findOne({ _id: args.id, name: args.name });

      if (!recordToDelete) {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'Record not found. Unable to delete.',
          data: null
        };
      }

      const filePath = path.join(process.cwd(), recordToDelete.file.filePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        await MediaModel.deleteOne({ _id: args.id });

        return {
          code: STATUS_CODE.CODE_OK,
          message: 'Media file and record deleted successfully.',
          data: null
        };
      } else {
        return {
          code: STATUS_CODE.CODE_NOT_FOUND,
          message: 'Sorry! This file is not found that directory.',
          data: null
        };
      }
    } catch (error: any) {
      return {
        code: error?.errorResponse?.code || STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        message: error?.errorResponse?.errmsg || 'An error occurred during the deletion process',
        error: error
      };
    }
  }
}

export default new MediaModelAction();
