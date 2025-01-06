import gql from 'graphql-tag';

const rolesTypes = gql`
  type DeletedAt {
    date: String
    user_id: String
  }

  type accessControlType {
    features: featureResponse
    permissions: [permissionResponse]
  }

  type rolesResponse {
    _id: String
    name: String
    description: String
    is_active: Boolean
    access_control: [accessControlType]
    created_at: String
    updated_at: String
    deleted_at: DeletedAt
  }

  type singleRoleResponseType {
    status: Int
    message: String
    data: rolesResponse
    error: String
  }

  type arrayRolesResponseType {
    status: Int
    message: String
    data: [rolesResponse]
    error: String
  }

  type arrayRolesAccessControlType {
    status: Int
    message: String
    data: [accessControlType]
    error: String
  }
`;

const rolesInputs = gql`
  input accessControlInput {
    feature_id: String
    permission_id: [String]
  }

  input rolesInput {
    name: String
    description: String
    accessControl: [accessControlInput]
  }
`;

const rolesQueries = gql`
  extend type Query {
    allRoles(status: Int!): arrayRolesResponseType
    singleRoles(id: String, name: String): singleRoleResponseType
  }
`;

const rolesMutations = gql`
  extend type Mutation {
    createRoles(rolesData: rolesInput): apiBooleanResponseType
    updateRoles(id: ID!, rolesData: rolesInput): apiBooleanResponseType
    updateStatusRole(id: ID!, status: Boolean): apiBooleanResponseType
    tempDeleteRoles(id: ID!): apiBooleanResponseType
    restoreRoles(id: ID!, name: String): apiBooleanResponseType
    permanentlyDeleteRoles(id: ID!, name: String): apiBooleanResponseType
  }
`;

const rolesTypeDefs = gql`
  ${rolesTypes}
  ${rolesInputs}
  ${rolesQueries}
  ${rolesMutations}
`;

export default rolesTypeDefs;
