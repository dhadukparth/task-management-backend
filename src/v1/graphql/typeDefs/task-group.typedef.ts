import gql from 'graphql-tag';

const taskGroupEnums = gql`
  enum taskGroupTypeEnum {
    GROUP
    LABEL
  }
`;

const taskGroupTypes = gql`
  type singleGroupLabelType {
    _id: ID
    name: String
    description: String
    color: String
    is_active: Boolean
    created_at: String
    updated_at: String
  }

  type singleTaskGroupResponse {
    project: projectDataResponse
    group: [singleGroupLabelType]
    labels: [singleGroupLabelType]
  }

  type apiSingleTaskGroupResponse {
    status: Int
    message: String
    data: singleTaskGroupResponse
    error: String
  }

  type apiMultipleTaskGroupResponse {
    status: Int
    message: String
    data: [singleTaskGroupResponse]
    error: String
  }
`;

const taskGroupInputTypes = gql`
  input taskGroupInput {
    projectId: String!
    name: String!
    description: String
    color: String
  }
`;

const taskGroupQueries = gql`
  extend type Query {
    getAllTaskGroupLabel(type: taskGroupTypeEnum): apiMultipleTaskGroupResponse
    getSingleTaskGroupLabel(projectId: String!): apiSingleTaskGroupResponse
  }
`;

const taskGroupMutations = gql`
  extend type Mutation {
    # group
    createTaskGroup(data: taskGroupInput): apiBooleanResponseType
    updateTaskLabel(id: String!, data: taskGroupInput): apiBooleanResponseType
    updateStatusTaskGroup(id: String!, projectId: String!): apiBooleanResponseType
    deletePermanentlyTaskGroup(projectId: String!, ids: [String!]): apiBooleanResponseType

    # label
    createTaskLabel(data: taskGroupInput): apiBooleanResponseType
    updateTaskGroup(id: String!, data: taskGroupInput): apiBooleanResponseType
    updateStatusTaskLabel(id: String!, projectId: String!): apiBooleanResponseType
    deletePermanentlyTaskLabel(projectId: String!, ids: [String!]): apiBooleanResponseType
  }
`;

const taskGroupTypeDefs = gql`
  ${taskGroupEnums}
  ${taskGroupTypes}
  ${taskGroupInputTypes}
  ${taskGroupQueries}
  ${taskGroupMutations}
`;

export default taskGroupTypeDefs;
