import { gql } from 'graphql-tag';
import authTypeDefs from './auth.typedef';
import departmentTypeDefs from './department.typedef';
import featureTypeDefs from './features.typedef';
import mediaTypeDefs from './media.typedef';
import permissionTypeDefs from './permission.typedef';
import projectTypeDefs from './project.typedef';
import rolesTypeDefs from './roles.typedef';
import taskCategoryTypeDefs from './task-category.typedef';
import taskGroupTypeDefs from './task-group.typedef';
import taskListTypedef from './task.typedef';
import teamTypeDefs from './team.typedef';
import userTagTypeDefs from './user-tag.typedef';
import userTypeDefs from './user.typedef';

export default gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type apiBooleanResponseType {
    status: Int
    message: String
    data: Boolean
    error: String
  }

  type apiIsActiveType {
    label: String
    value: Boolean
  }

  ${permissionTypeDefs}
  ${featureTypeDefs}
  ${rolesTypeDefs}
  ${departmentTypeDefs}
  ${userTagTypeDefs}
  ${mediaTypeDefs}
  ${userTypeDefs}
  ${authTypeDefs}
  ${teamTypeDefs}
  ${taskCategoryTypeDefs}
  ${taskGroupTypeDefs}
  ${projectTypeDefs}
  ${taskListTypedef}
`;
