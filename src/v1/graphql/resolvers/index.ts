import authResolvers from './auth.resolvers';
import departmentResolvers from './department.resolvers';
import featureResolvers from './features.resolvers';
import mediaResolvers from './media.resolvers';
import permissionResolvers from './permission.resolvers';
import projectResolvers from './project.resolvers';
import rolesResolvers from './roles.resolvers';
import taskCategoryResolvers from './task-category.resolvers';
import taskGroupResolvers from './task-group.resolvers';
import taskResolvers from './task.resolvers';
import teamResolvers from './team.resolvers';
import userTagResolvers from './user-tag.resolvers';
import userResolvers from './user.resolvers';

export default {
  Query: {
    ...permissionResolvers.Query,
    ...featureResolvers.Query,
    ...rolesResolvers.Query,
    ...departmentResolvers.Query,
    ...userTagResolvers.Query,
    ...mediaResolvers.Query,
    ...userResolvers.Query,
    ...teamResolvers.Query,
    ...taskCategoryResolvers.Query,
    ...taskGroupResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query
  },
  Mutation: {
    ...permissionResolvers.Mutation,
    ...featureResolvers.Mutation,
    ...rolesResolvers.Mutation,
    ...departmentResolvers.Mutation,
    ...userTagResolvers.Mutation,
    ...mediaResolvers.Mutation,
    ...userResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...taskCategoryResolvers.Mutation,
    ...taskGroupResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...authResolvers.Mutation
  }
};
