import CryptoJS from 'crypto-js';
import ENVIRONMENT_VARIABLES from '../config/env.config';

// Configuration constants
const SECRET_KEY = ENVIRONMENT_VARIABLES.NODE_CRYPTO_JS.SECRET_KEY as string; // Replace with your actual secret key

/**
 * Encrypts a given plaintext using AES encryption.
 * @param plaintext - The text to be encrypted.
 * @returns A promise that resolves to the encrypted text as a Base64 string.
 */
async function encrypt(plaintext: string | number | object): Promise<string> {
  if (plaintext === undefined || plaintext === null) {
    throw new Error('Plaintext cannot be empty');
  }

  // Convert the input to a string based on its type
  let stringifiedPlaintext: string;
  if (typeof plaintext === 'object') {
    stringifiedPlaintext = JSON.stringify(plaintext); // Serialize objects
  } else {
    stringifiedPlaintext = plaintext.toString(); // Convert numbers to strings
  }

  // Encrypt the stringified plaintext
  const cipherText = CryptoJS.AES.encrypt(stringifiedPlaintext, SECRET_KEY).toString();
  return Promise.resolve(cipherText);
}

/**
 * Decrypts a given cipHerText using AES decryption.
 * @param cipHerText - The encrypted text as a Base64 string.
 * @returns A promise that resolves to the decrypted plaintext.
 */
async function decrypt(cipHerText: string): Promise<string> {
  if (!cipHerText) {
    throw new Error('cipHerText cannot be empty');
  }
  try {
    const bytes = CryptoJS.AES.decrypt(cipHerText, SECRET_KEY);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    if (!plaintext) {
      throw new Error('Decryption failed. Invalid cipHerText or secret key.');
    }

    // Attempt to parse JSON if the plaintext is a valid JSON string
    try {
      const convertToObject = JSON.parse(plaintext);
      return Promise.resolve(convertToObject);
    } catch {
      // If JSON.parse fails, return plaintext as is
      return Promise.resolve(plaintext);
    }
  } catch (error: any) {
    throw new Error(`An error occurred during decryption: ${error.message}`);
  }
}

/**
 * Generates an HMAC hash for a given message.
 * @param message - The message to be hashed.
 * @returns A promise that resolves to the HMAC hash as a hexadecimal string.
 */
async function generateHmac(message: string): Promise<string> {
  if (!message) {
    throw new Error('Message cannot be empty');
  }
  const hmac = CryptoJS.HmacSHA256(message, SECRET_KEY).toString(CryptoJS.enc.Hex);
  return Promise.resolve(hmac);
}

/**
 * Hashes a given plaintext using SHA-256.
 * @param plaintext - The text to be hashed.
 * @returns A promise that resolves to the hashed text as a hexadecimal string.
 */
async function hashSHA256(plaintext: string): Promise<string> {
  if (!plaintext) {
    throw new Error('Plaintext cannot be empty');
  }
  const hash = CryptoJS.SHA256(plaintext).toString(CryptoJS.enc.Hex);
  return Promise.resolve(hash);
}

/**
 * Verifies if a plaintext matches a given hash.
 * @param plaintext - The original plaintext.
 * @param hash - The hash to be verified against.
 * @returns A promise that resolves to true if the hash matches the plaintext, false otherwise.
 */
async function verifyHash(plaintext: string, hash: string): Promise<boolean> {
  const calculatedHash = await hashSHA256(plaintext);
  return Promise.resolve(calculatedHash === hash);
}

/**
 * Generates a random string of a given length.
 * @param length - The length of the random string to generate.
 * @returns A promise that resolves to a random alphanumeric string.
 */
async function generateRandomString(length: number): Promise<string> {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }
  const randomString = CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex);
  return Promise.resolve(randomString.slice(0, length));
}

export const AppCryptoJs = {
  encrypt,
  decrypt,
  generateHmac,
  hashSHA256,
  verifyHash,
  generateRandomString
};
