import { FileUpload } from 'graphql-upload-ts';
import STATUS_CODE from '../../helper/statusCode';
import MediaModelAction from '../model/media/media-action';
import { IActionMedia } from '../types/model/model-action';
import { ServerError, ServerResponse } from '../utils/response';

class MediaController {
  async uploadMediaFeature(
    _parent: any,
    { uploadFile, mediaData }: { uploadFile: FileUpload; mediaData: IActionMedia['upload_file'] }
  ) {
    if (!uploadFile) {
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Invalid input',
        'File is required'
      );
    }

    const actionResponse = await MediaModelAction.uploadMediaFeatureAction(uploadFile, mediaData);

    if (actionResponse?.code === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }
  }

  async getAllMediaFeature() {
    const mediaResponse = await MediaModelAction.getAllMediaFeatureAction();
    return ServerResponse(mediaResponse?.code, mediaResponse?.message, mediaResponse?.data);
  }

  async getSingleMediaFeature(
    _parent: any,
    { mediaData }: { mediaData: IActionMedia['single_file'] }
  ) {
    const singleFile = {
      id: mediaData.id,
      name: mediaData.name
    };

    const actionResponse = await MediaModelAction.getSingleMediaFeatureAction(singleFile);

    if (actionResponse?.code === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }
  }

  async deleteMediaFeature(
    _parent: any,
    { mediaData }: { mediaData: IActionMedia['single_file'] }
  ) {
    const singleFile = {
      id: mediaData.id,
      name: mediaData.name
    };
    const actionResponse = await MediaModelAction.deleteMediaFeatureAction(singleFile);

    if (actionResponse?.code === STATUS_CODE.CODE_OK) {
      return ServerResponse(actionResponse?.code, actionResponse?.message, actionResponse?.data);
    } else {
      return ServerError(actionResponse?.code, actionResponse?.message, actionResponse?.error);
    }
  }
}

export const mediaController = new MediaController();
