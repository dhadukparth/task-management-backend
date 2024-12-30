import bcrypt from 'bcrypt';

// Number of salt rounds (adjust based on your security requirements)
const SALT_ROUNDS = 10;

/**
 * Hash a password
 * @param plainTextPassword - The password to be hashed
 * @returns Promise<string> - The hashed password
 */
const hashPassword = async (plainTextPassword: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing the password');
  }
};

/**
 * Verify a password
 * @param plainTextPassword - The password to verify
 * @param hashedPassword - The stored hashed password
 * @returns Promise<boolean> - True if passwords match, otherwise false
 */
const verifyPassword = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error verifying the password');
  }
};

export const bcryptFn = {
  hashPassword,
  verifyPassword
};
