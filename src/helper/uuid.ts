import { v4 as uuidv4 } from 'uuid';
import DateTimeUtils from './moment';

/**
 * Function to generate a unique key
 * @param dynamicData Optional data to include and convert to ASCII
 * @param keyLength Length of the generated key (default is 16)
 * @param dashInterval Interval for inserting the '-' symbol (default is 4)
 * @returns Generated unique key
 */

export const generateUniqueKey = (
  keyLength: number = 16,
  dashInterval: number = 4,
  dynamicData?: string
): string => {
  const currentDateUTC = DateTimeUtils.getCurrentUTCTime();

  const asciiValue = dynamicData
    ? dynamicData
        .split('')
        .map((char) => char.charCodeAt(0))
        .join('')
    : '';

  const randomUUIDPart = uuidv4()
    .replace(/-/g, '')
    .slice(0, keyLength - currentDateUTC.toString().length - asciiValue.length);

  const generateKey = `${currentDateUTC}${asciiValue}${randomUUIDPart}`;

  const uniqueKey =
    generateKey.match(new RegExp(`.{1,${dashInterval}}`, 'g'))?.join('-') ?? generateKey;

  return uniqueKey.slice(0, keyLength + Math.floor(keyLength / dashInterval));
};

export const decodeUniqueKey = (
  key: string,
  dashInterval: number = 4
): {
  timestamp: string;
  dynamicData?: string;
  randomPart: string;
} => {
  // Remove dashes from the key
  const keyWithoutDashes = key.replace(/-/g, '');

  // Extract timestamp (assuming it's a known fixed length)
  const timestampLength = 13; // Adjust based on `DateTimeUtils.getCurrentUTCTime` format
  const timestamp = keyWithoutDashes.slice(0, timestampLength);

  // Extract ASCII values (if dynamic data is present)
  const asciiValuesLength = keyWithoutDashes.length - timestampLength - 16; // UUID part is 16 chars
  const asciiValues = keyWithoutDashes.slice(timestampLength, timestampLength + asciiValuesLength);

  // Convert ASCII values back to characters
  const dynamicData = asciiValues
    ? asciiValues
        .match(/.{1,2}/g)
        ?.map((ascii) => String.fromCharCode(parseInt(ascii, 10)))
        .join('')
    : undefined;

  // Extract random part
  const randomPart = keyWithoutDashes.slice(timestampLength + asciiValuesLength);

  return {
    timestamp,
    dynamicData,
    randomPart
  };
};
