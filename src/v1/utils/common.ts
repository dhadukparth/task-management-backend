import DateTimeUtils from '../../helper/moment';
import { generateUniqueKey } from '../../helper/uuid';

export const generatePassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbols = "!@#$%^&*()_+[]{}|;:',.<>?";
  const numbers = '0123456789';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';

  const getRandomChars = (chars: string, count: number) =>
    Array.from({ length: count }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

  const upperCasePart = getRandomChars(uppercase, 3);
  const symbolPart = getRandomChars(symbols, 3);
  const numberPart = getRandomChars(numbers, 3);
  const lowerCasePart = getRandomChars(lowercase, 3);

  // Combine and shuffle the password
  const password = upperCasePart + symbolPart + numberPart + lowerCasePart;
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

export const generateFile = async (fileName: string): Promise<string> => {
  // Convert today's date to UTC
  const utcDateTime = DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC');

  // Format date into groups of 4 characters, separated by dashes
  const formattedDate = utcDateTime
    .toString()
    .match(/.{1,4}/g)
    ?.join('-');

  // Generate a unique key (assuming generateUniqueKey is a valid function)
  const uniqueKey = generateUniqueKey(16, 4);

  // Convert filename to ASCII representation
  const asciiValue = fileName
    ? fileName
        .split('')
        .map((char) => char.charCodeAt(0))
        .join('')
    : '';

  // Format ASCII values with dashes
  const asciiFormatted = asciiValue.match(/.{1,4}/g)?.join('-');

  // Construct final file identifier
  return `${formattedDate}-${uniqueKey}-${asciiFormatted}`;
};

export const decodeFileName = async (
  encodedString: string
): Promise<{
  fileName: string;
  generateId: string;
  utcDateTime: string;
}> => {
  const parts = encodedString.split('-');

  // Extract UTC date (first 4 groups)
  const utcDateTime = parts.slice(0, 4).join('');

  // Extract generateId (next 4 groups)
  const generateId = parts.slice(4, 8).join('');

  // Extract ASCII-encoded file name and convert back to string
  const asciiValues = parts.slice(8);
  const fileName = asciiValues.map((ascii) => String.fromCharCode(parseInt(ascii, 10))).join('');

  return { fileName, generateId, utcDateTime };
};
