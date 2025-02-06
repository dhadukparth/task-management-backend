import { ApolloServer } from '@apollo/server';
import { Application } from 'express';
import ENVIRONMENT_VARIABLES from './config/env.config';

import { expressMiddleware } from '@apollo/server/express4';
import clc from 'cli-color';
import { GraphQLFormattedError } from 'graphql';
import { graphqlContext, graphqlResolvers, graphqlTypeDefs } from './v1/graphql';

const createApolloServer = async (app: Application): Promise<void> => {
  try {
    // NOTE: Create an ApolloServer instance
    const apolloServer = new ApolloServer({
      typeDefs: graphqlTypeDefs.default,
      resolvers: graphqlResolvers.default,
      formatError: (formattedError: GraphQLFormattedError): GraphQLFormattedError => {
        // console.log(formattedError);
        return {
          message: formattedError.message,
          locations: formattedError.locations,
          path: formattedError.path,
          extensions: {
            code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
            details: formattedError.extensions?.details
          }
        };
      }
      // formatError: graphqlFormatError.graphqlFormatError
    });

    // NOTE: Start Apollo Server
    await apolloServer.start();

    // NOTE: Apply Apollo middleware to Express app
    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: graphqlContext.default
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

export default createApolloServer;
