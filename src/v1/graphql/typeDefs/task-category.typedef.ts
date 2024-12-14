import gql from 'graphql-tag';

const taskCategoryTypes = gql`
  type singleTaskCategoryResponse {
    _id: ID
    name: String
    description: String
    is_active: Boolean
    created_at: Float
    updated_at: Float
  }

  type apiSingleTaskCategoryResponse {
    status: Int
    message: String
    data: singleTaskCategoryResponse
  }

  type apiMultipleTaskCategoryResponse {
    status: Int
    message: String
    data: [singleTaskCategoryResponse]
  }
`;

const taskCategoryInputTypes = gql`
  input taskCategoryInput {
    name: String!
    description: String
  }
`;

const taskCategoryQueries = gql`
  extend type Query {
    getAllTaskCategory: apiMultipleTaskCategoryResponse
    getSingleTaskCategory(id: String, name: String): apiSingleTaskCategoryResponse
  }
`;

const taskCategoryMutations = gql`
  extend type Mutation {
    createTaskCategory(data: taskCategoryInput): responseBooleanType
    updateTaskCategory(id: String!, data: taskCategoryInput): responseBooleanType
    updateStatusTaskCategory(id: String!, status: Boolean): responseBooleanType
    deletePermanentlyTaskCategory(ids: [String!]): responseBooleanType
  }
`;

const taskCategoryTypeDefs = gql`
  ${taskCategoryTypes}
  ${taskCategoryInputTypes}
  ${taskCategoryQueries}
  ${taskCategoryMutations}
`;

export default taskCategoryTypeDefs;
