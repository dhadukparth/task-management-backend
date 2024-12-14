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
    permissions: arrayPermissionsResponseType
    permission(id: ID!): singlePermissionResponseType
    rollBackPermission: arrayPermissionsResponseType
  }
`;

const permissionMutations = gql`
  extend type Mutation {
    createPermission(permissionData: permissionInput): singlePermissionResponseType
    updatePermission(id: ID!, permissionData: permissionInput): singlePermissionResponseType
    updateStatusPermission(id: ID!, status: Boolean): singlePermissionResponseType
    tempDeletePermission(id: ID!): singlePermissionResponseType
    rollBackPermission(id: ID!, name: String): singlePermissionResponseType
    rollBackDeletePermission(id: ID!, name: String): singlePermissionResponseType
  }
`;

const permissionTypeDefs = gql`
  ${permissionTypes}
  ${permissionInputTypes}
  ${permissionQueries}
  ${permissionMutations}
`;

export default permissionTypeDefs;
