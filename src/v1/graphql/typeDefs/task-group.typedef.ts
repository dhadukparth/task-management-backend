import gql from 'graphql-tag';

const taskGroupTypes = gql`
  type singleTaskGroupResponse {
    _id: ID
    name: String
    description: String
    color: String
    is_active: Boolean
    created_at: Float
    updated_at: Float
  }

  type apiSingleTaskGroupResponse {
    status: Int
    message: String
    data: singleTaskGroupResponse
  }

  type apiMultipleTaskGroupResponse {
    status: Int
    message: String
    data: [singleTaskGroupResponse]
  }
`;

const taskGroupInputTypes = gql`
  input taskGroupInput {
    name: String!
    description: String
    color: String
  }
`;

const taskGroupQueries = gql`
  extend type Query {
    getAllTaskGroup: apiMultipleTaskGroupResponse
    getSingleTaskGroup(id: String, name: String): apiSingleTaskGroupResponse
  }
`;

const taskGroupMutations = gql`
  extend type Mutation {
    createTaskGroup(data: taskGroupInput): apiBooleanResponseType
    updateTaskGroup(id: String!, data: taskGroupInput): apiBooleanResponseType
    updateStatusTaskGroup(id: String!, status: Boolean): apiBooleanResponseType
    deletePermanentlyTaskGroup(ids: [String!]): apiBooleanResponseType
  }
`;

const taskGroupTypeDefs = gql`
  ${taskGroupTypes}
  ${taskGroupInputTypes}
  ${taskGroupQueries}
  ${taskGroupMutations}
`;

export default taskGroupTypeDefs;
