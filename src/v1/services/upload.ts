import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import DateTimeUtils from '../../helper/moment';
import { generateUniqueKey } from '../../helper/uuid';
import { FILE_UPLOAD_PATH } from '../constant';

export type ApolloFileType = 'ICON' | 'IMAGE' | 'DOCUMENT';

type ApolloFileUploadReturn = {
  fileName: string;
  domain: string;
  filePath: string;
};

const ApolloFileUpload = async (fileType: ApolloFileType, file: any): Promise<ApolloFileUploadReturn> => {
  try {
    // NOTE: Await the promise to get the file details
    const { createReadStream, filename } = await file.file;

    if (!filename) {
      throw new Error('Filename is undefined');
    }

    // NOTE: Determine the correct upload path based on the file type
    let fileUploadPath: string = FILE_UPLOAD_PATH.DEFAULT;
    if (fileType === 'DOCUMENT') {
      fileUploadPath = FILE_UPLOAD_PATH.DOCUMENT_PATH;
    } else if (fileType === 'IMAGE') {
      fileUploadPath = FILE_UPLOAD_PATH.IMAGE_PATH;
    } else if (fileType === 'ICON') {
      fileUploadPath = FILE_UPLOAD_PATH.ICON_PATH;
    }

    // NOTE: Generate a unique filename
    const utcDateTime = DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC');
    const formattedDate = utcDateTime
      .toString()
      .match(/.{1,4}/g)
      ?.join('-');
    const uniqueKey = generateUniqueKey(16, 4);
    const customFileName = `${uniqueKey}--${formattedDate}`;
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
