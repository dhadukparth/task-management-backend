import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import path from 'path';

import { databaseConnection } from './config/db.config';
import ENVIRONMENT_VARIABLES from './config/env.config';

import clc from 'cli-color';
import { FILE_UPLOAD_PATH } from './v1/constant';
import resolvers from './v1/graphql/resolvers';
import typeDefs from './v1/graphql/typeDefs';

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

// NOTE: Serve static files from the 'images' subdirectory within the specified root path
// NOTE: The static files will be accessible at the '/images' route
app.use(FILE_UPLOAD_PATH.GET_IMAGES, express.static(path.join(assetsPath, 'images')));

// TODO: Function to start the server
const mainServer = async (): Promise<void> => {
  try {
    await databaseConnection();

    // NOTE: Create an ApolloServer instance
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers
    });

    // NOTE: Start Apollo Server
    await apolloServer.start();

    // NOTE: Apply Apollo middleware to Express app
    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({ req, res })
      })
    );

    // NOTE: Start Express server
    app.listen(ENVIRONMENT_VARIABLES.NODE_PORT, () => {
      console.log(
        clc.magenta(
          `[SERVER INFO]: Server is running at http://localhost:${ENVIRONMENT_VARIABLES.NODE_PORT}/graphql`
        )
      );
    });
  } catch (error) {
    console.error('Error starting server', error);
  }
};

mainServer();
