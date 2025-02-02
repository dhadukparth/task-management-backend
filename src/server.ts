import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import path from 'path';

import { databaseConnection } from './config/db.config';

import createApolloServer from './apollo-server';
import { FILE_UPLOAD_PATH } from './v1/constant';

dotenv.config();

const app: Application = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));

// NOTE: Apply the middleware for handling file uploads
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// NOTE: Import the 'path' module for handling and transforming file paths
const assetsPath = path.join(process.cwd(), FILE_UPLOAD_PATH.ROOT);

// NOTE: Serve static files from the 'image' subdirectory within the specified root path
// NOTE: The static files will be accessible at the '/image' route
app.use(`/${FILE_UPLOAD_PATH.GET_IMAGE}`, express.static(path.join(assetsPath, 'images')));

// TODO: Function to start the server
const mainServer = async (): Promise<void> => {
  await databaseConnection();
  await createApolloServer(app);
};

mainServer();
