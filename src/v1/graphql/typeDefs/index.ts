import { gql } from 'graphql-tag';
import departmentTypeDefs from './department.typedef';
import featureTypeDefs from './features.typedef';
import mediaTypeDefs from './media.typedef';
import permissionTypeDefs from './permission.typedef';
import rolesTypeDefs from './roles.typedef';
import taskCategoryTypeDefs from './task-category.typedef';
import taskGroupTypeDefs from './task-group.typedef';
import teamTypeDefs from './team.typedef';
import userTagTypeDefs from './user-tag.typedef';
import userTypeDefs from './user.typedef';
import authTypeDefs from './auth.typedef';
import projectTypeDefs from './project.typedef';

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
`;
