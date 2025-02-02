import { FileUpload } from 'graphql-upload-ts';
import STATUS_CODE from '../../helper/statusCode';
import MediaModelAction from '../model/media/media-action';
import { IActionMedia } from '../types/model/model-action';
import { ServerError } from '../utils/response';

class MediaController {
  async getAllMediaFeature() {
    const actionResponse = await MediaModelAction.getAllMediaFeatureAction();
    return actionResponse;
  }

  async getSingleMediaFeature(_parent: any, { fileId, name }: { fileId: string; name: string }) {
    const singleFile = {
      id: fileId,
      name: name
    };

    const actionResponse = await MediaModelAction.getSingleMediaFeatureAction(singleFile);

    return actionResponse;
  }

  /**
   *
   * Action function here
   *
   */

  async uploadSingleMediaFeature(
    _parent: any,
    { uploadFile, mediaData }: { uploadFile: FileUpload; mediaData: IActionMedia['upload_file'] }
  ) {
    if (!uploadFile) {
      return ServerError(
        STATUS_CODE.CODE_INTERNAL_SERVER_ERROR,
        'Sorry!, Upload file is not found, please upload file again',
        null
      );
    }

    const actionResponse = await MediaModelAction.uploadMediaFeatureAction(uploadFile, mediaData);

    return actionResponse;
  }

  async deleteMediaFeature(_parent: any, { fileId, name }: { fileId: string; name: string }) {
    const singleFile = {
      id: fileId,
      name: name
    };
    const actionResponse = await MediaModelAction.deleteMediaFeatureAction(singleFile);

    return actionResponse;
  }
}

export const mediaController = new MediaController();
