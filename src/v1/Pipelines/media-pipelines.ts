import ENVIRONMENT_VARIABLES from '../../config/env.config';
import { FILE_UPLOAD_PATH, UPLOAD_FILE_TYPE } from '../constant';

const BACKEND_URL = ENVIRONMENT_VARIABLES.NODE_BACKEND_URL;
const uploadImagePath = `${BACKEND_URL}/${FILE_UPLOAD_PATH.GET_IMAGE}`;
const uploadIconPath = `${BACKEND_URL}/${FILE_UPLOAD_PATH.GET_ICON}`;
const uploadDocumentPath = `${BACKEND_URL}/${FILE_UPLOAD_PATH.GET_DOCUMENT}`;

export const media_pipelines = [
  {
    $addFields: {
      'file.filePath': {
        $switch: {
          branches: [
            {
              case: {
                $eq: ['$fileType', UPLOAD_FILE_TYPE.IMAGE]
              },
              then: {
                $concat: [uploadImagePath, '/', '$file.fileName']
              }
            },
            {
              case: {
                $eq: ['$fileType', UPLOAD_FILE_TYPE.DOCUMENT]
              },
              then: {
                $concat: [uploadDocumentPath, '/', '$file.fileName']
              }
            },
            {
              case: {
                $eq: ['$fileType', UPLOAD_FILE_TYPE.ICON]
              },
              then: {
                $concat: [uploadIconPath, '/', '$file.fileName']
              }
            }
          ],
          default: '$file.filePath'
        }
      },
      created_at: {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$created_at' }
        }
      }
    }
  },
  {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      description: { $first: '$description' },
      file: {
        $first: {
          fileType: '$fileType',
          fileName: '$file.fileName',
          filePath: '$file.filePath'
        }
      },
      created_at: { $first: '$created_at' }
    }
  }
];
