import { gql } from 'graphql-tag';

const permissionTypes = gql`
  type permission {
    name: String
    description: String
  }

  type DeletedAt {
    date: String
  }

  type permissionResponse {
    _id: ID!
    name: String!
    description: String
    is_active: Boolean!
    created_at: String!
    deleted_at: DeletedAt
  }

  type singlePermissionResponseType {
    status: Int
    message: String
    data: permissionResponse
    error: String
  }

  type arrayPermissionsResponseType {
    status: Int
    message: String
    data: [permissionResponse]
    error: String
  }
`;

const permissionInputTypes = gql`
  input permissionInput {
    name: String
    description: String
  }
`;

const permissionQueries = gql`
  extend type Query {
    permissions(status: Int!): arrayPermissionsResponseType
    permission(id: ID!): singlePermissionResponseType
  }
`;

const permissionMutations = gql`
  extend type Mutation {
    createPermission(permissionData: permissionInput): apiBooleanResponseType
    updatePermission(id: ID!, permissionData: permissionInput): apiBooleanResponseType
    updateStatusPermission(id: ID!, status: Boolean): apiBooleanResponseType
    tempDeletePermission(id: ID!): apiBooleanResponseType
    rollBackPermission(id: ID!, name: String): apiBooleanResponseType
    rollBackDeletePermission(id: ID!, name: String): apiBooleanResponseType
  }
`;

const permissionTypeDefs = gql`
  ${permissionTypes}
  ${permissionInputTypes}
  ${permissionQueries}
  ${permissionMutations}
`;

export default permissionTypeDefs;
