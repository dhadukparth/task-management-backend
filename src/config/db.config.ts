const mongoose = require('mongoose')

import clc from 'cli-color'
import ENVIRONMENT_VARIABLES from './env.config'

export const databaseConnection = async () => {
  try {
    await mongoose.connect(ENVIRONMENT_VARIABLES.NODE_DB_CONNECTION_URI)
    console.log(clc.cyan(`[DB INFO]: Database connection established`))
  } catch (error: any) {
    console.log(clc.red(`[DB ERROR]: ${error?.message}`))
    process.exit(1)
  }
}
