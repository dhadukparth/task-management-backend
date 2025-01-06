import { gql } from 'graphql-tag';

const featuresTypes = gql`
  type featureResponse {
    _id: ID!
    name: String!
    description: String
    created_at: String!
  }

  type singleFeatureResponseType {
    status: Int
    message: String
    data: featureResponse
    error: String
  }

  type arrayFeaturesResponseType {
    status: Int
    message: String
    data: [featureResponse]
    error: String
  }
`;

const featureInputTypes = gql`
  input featureInput {
    name: String
    description: String
  }
`;

const featureQueries = gql`
  extend type Query {
    featuresList(status: Int!): arrayFeaturesResponseType
    singleFeature(id: ID!): singleFeatureResponseType
  }
`;

const featureMutations = gql`
  extend type Mutation {
    createFeature(featureData: featureInput): apiBooleanResponseType
    updateFeature(id: ID!, featureData: featureInput): apiBooleanResponseType
    deletePermanentlyFeature(id: ID!, name: String): apiBooleanResponseType
  }
`;

const featureTypeDefs = gql`
  ${featuresTypes}
  ${featureInputTypes}
  ${featureQueries}
  ${featureMutations}
`;

export default featureTypeDefs;
