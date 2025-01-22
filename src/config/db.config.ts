const mongoose = require('mongoose');

import clc from 'cli-color';
import ENVIRONMENT_VARIABLES from './env.config';

/**
 * Establishes a connection to the MongoDB database.
 * @returns A promise that resolves when the database connection is successful or rejects if an error occurs.
 */

export const databaseConnection = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(ENVIRONMENT_VARIABLES.NODE_DB_CONNECTION_URI);
      console.log(clc.cyan(`[DB INFO]: Database connection established`));
      resolve();
    } catch (error: any) {
      console.log(clc.red(`[DB ERROR]: ${error?.message}`));
      process.exit(1);
      reject();
    }
  });
};
