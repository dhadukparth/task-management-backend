import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { FILE_UPLOAD_PATH, UPLOAD_FILE_TYPE } from '../constant';
import { generateFile } from '../utils/common';

export type ApolloFileType = 'ICON' | 'IMAGE' | 'DOCUMENT';

type ApolloFileUploadReturn = {
  fileName: string;
  domain: string;
  filePath: string;
};

const ApolloFileUpload = async (
  fileType: ApolloFileType,
  file: any,
  dynamicData: string
): Promise<ApolloFileUploadReturn> => {
  try {
    console.log(file);
    // NOTE: Await the promise to get the file details
    const { createReadStream, filename } = await file;

    if (!filename) {
      throw new Error('Filename is undefined');
    }

    // NOTE: Determine the correct upload path based on the file type
    let fileUploadPath: string = FILE_UPLOAD_PATH.DEFAULT;
    if (fileType === UPLOAD_FILE_TYPE.DOCUMENT) {
      fileUploadPath = FILE_UPLOAD_PATH.DOCUMENT_PATH;
    } else if (fileType === UPLOAD_FILE_TYPE.IMAGE) {
      fileUploadPath = FILE_UPLOAD_PATH.IMAGE_PATH;
    } else if (fileType === UPLOAD_FILE_TYPE.ICON) {
      fileUploadPath = FILE_UPLOAD_PATH.ICON_PATH;
    }

    // NOTE: Generate a unique filename
    const customFileName = await generateFile(dynamicData);
    const finalFileName = `${customFileName.replace(/-/g, '_')}${path.extname(filename)}`;

    // NOTE: Construct the file path
    const filePath = path.join(process.cwd(), fileUploadPath, finalFileName);

    // NOTE: Ensure the directory exists or create it if necessary
    const dir = path.dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // NOTE: Use pipeline for safer file streaming
    const stream = createReadStream();
    await pipeline(stream, createWriteStream(filePath));

    return {
      fileName: finalFileName,
      domain: process.cwd(),
      filePath: fileUploadPath + '/' + finalFileName
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export default ApolloFileUpload;
