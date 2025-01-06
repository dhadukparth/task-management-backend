import { gql } from 'graphql-tag';

const departmentTypes = gql`
  type departmentResponse {
    _id: ID!
    name: String!
    description: String
    is_active: Boolean!
    created_at: String!
  }

  type singleDepartmentResponseType {
    status: Int
    message: String
    data: departmentResponse
    error: String
  }

  type arrayDepartmentResponseType {
    status: Int
    message: String
    data: [departmentResponse]
    error: String
  }
`;

const departmentInputTypes = gql`
  input departmentInput {
    name: String
    description: String
  }
`;

const departmentQueries = gql`
  extend type Query {
    getAllDepartment: arrayDepartmentResponseType
    getSingleDepartment(id: ID!): singleDepartmentResponseType
  }
`;

const departmentMutations = gql`
  extend type Mutation {
    createDepartment(departmentData: departmentInput): apiBooleanResponseType
    updateDepartment(id: ID!, departmentData: departmentInput): apiBooleanResponseType
    updateStatusDepartment(id: ID!, status: Boolean): apiBooleanResponseType
    deletePermanentlyDepartment(id: ID!, name: String): apiBooleanResponseType
  }
`;

const departmentTypeDefs = gql`
  ${departmentTypes}
  ${departmentInputTypes}
  ${departmentQueries}
  ${departmentMutations}
`;

export default departmentTypeDefs;
