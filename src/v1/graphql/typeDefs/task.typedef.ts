import gql from 'graphql-tag';

const taskListTypes = gql`
  enum TaskListEnum {
    NOT_DELETED
    DELETED
  }

  type taskDateType {
    startDate: String
    endDate: String
  }

  type singleTaskListResponse {
    _id: ID
    project: projectDataResponse
    name: String
    description: String
    is_active: apiIsActiveType
    labels: [singleGroupLabelType]
    group: singleGroupLabelType
    assignUser: String
    date: taskDateType
    created_at: String
  }

  type apiTaskListResponse {
    status: Int
    message: String
    data: singleTaskListResponse
    error: String
  }

  type apiMultipleTaskListResponse {
    status: Int
    message: String
    data: [singleTaskListResponse]
    error: String
  }
`;

const taskListInputs = gql`
  input taskListInput {
    projectId: String!
    name: String!
    assignUserId: String!
    description: String
    labelId: [String]
    groupId: String
    startDate: String
    endDate: String
  }
`;

const taskListQueries = gql`
  extend type Query {
    getAllTaskList(type: TaskListEnum!): apiMultipleTaskListResponse
    getSingleTaskList(projectId: String!, taskId: String!): apiTaskListResponse
  }
`;

const taskListMutations = gql`
  extend type Mutation {
    createTaskList(data: taskListInput): apiBooleanResponseType
    updateTaskList(taskId: String!, taskData: taskListInput): apiBooleanResponseType
    updateTaskStatusList(taskId: String!, projectId: String!): apiBooleanResponseType
    deleteTempTaskList(projectId: String!, taskId: String!): apiBooleanResponseType
    restoreTempTaskList(projectId: String!, taskId: String!): apiBooleanResponseType
    deletePermanentlyTaskList(projectId: String!, taskId: String!): apiBooleanResponseType
  }
`;

const taskListTypedef = gql`
  ${taskListTypes}
  ${taskListInputs}
  ${taskListQueries}
  ${taskListMutations}
`;

export default taskListTypedef;
