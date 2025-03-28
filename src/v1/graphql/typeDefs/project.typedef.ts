import gql from 'graphql-tag';

const projectType = gql`
  type DateResponse {
    start_date: String
    end_date: String
  }

  type projectDataResponse {
    _id: ID
    name: String
    description: String
    date: DateResponse
    is_active: Boolean
    created_at: String
    owner: singleUserResponse
    team: teamResponse
  }

  type apiSingleResponse {
    status: Int
    message: String
    data: projectDataResponse
    error: String
  }

  type apiMultipleResponse {
    status: Int
    message: String
    data: [projectDataResponse]
    error: String
  }
`;

const projectInput = gql`
  input projectDataInput {
    name: String!
    description: String!
    owner: String!
    team: String!
    startDate: String!
    endDate: String!
  }
`;

const projectQuery = gql`
  extend type Query {
    getAllProjects(status: Int!): apiMultipleResponse
    getSingleProject(projectId: String!, name: String!): apiSingleResponse
  }
`;

const projectMutations = gql`
  extend type Mutation {
    createProject(data: projectDataInput): apiBooleanResponseType
    updateStatusProject(id: ID!, status: Boolean): apiBooleanResponseType
    deleteTempPermission(id: ID!, name: String!): apiBooleanResponseType
    deletePermanentlyProject(id: ID!, name: String!): apiBooleanResponseType
    updateProject(id: ID!, data: projectDataInput): apiBooleanResponseType
  }
`;

const projectTypeDefs = gql`
  ${projectType}
  ${projectInput}
  ${projectQuery}
  ${projectMutations}
`;

export default projectTypeDefs;
