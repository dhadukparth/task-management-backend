import { gql } from 'graphql-tag';

const userTagTypes = gql`
  type singleUserTagResponse {
    _id: ID!
    name: String!
    description: String
    is_active: Boolean!
    created_at: String!
  }

  type singleUserTagResponseType {
    status: Int
    message: String
    data: singleUserTagResponse
    error: String
  }

  type arrayUserTagResponseType {
    status: Int
    message: String
    data: [singleUserTagResponse]
    error: String
  }
`;

const userTagInputTypes = gql`
  input userTagInput {
    name: String
    description: String
  }
`;

const userTagQueries = gql`
  extend type Query {
    getAllUserTags: arrayUserTagResponseType
    getSingleUserTag(id: ID!): singleUserTagResponseType
  }
`;

const userTagMutations = gql`
  extend type Mutation {
    createUserTag(userTagData: userTagInput): apiBooleanResponseType
    updateUserTag(id: ID!, userTagData: userTagInput): apiBooleanResponseType
    updateStatusUserTag(id: ID!, status: Boolean): apiBooleanResponseType
    deletePermanentlyUserTag(id: ID!, name: String): apiBooleanResponseType
  }
`;

const userTagTypeDefs = gql`
  ${userTagTypes}
  ${userTagInputTypes}
  ${userTagQueries}
  ${userTagMutations}
`;

export default userTagTypeDefs;
