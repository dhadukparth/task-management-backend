import { pipeline_created_at } from '.';
import { MODEL_COLLECTION_LIST } from '../constant';
import { user_pipelines } from './user-pipelines';

export const team_pipelines = [
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.USER, // Collection for leaders
      localField: 'leader',
      foreignField: '_id',
      as: 'leader',
      pipeline: [
        {
          $match: {
            is_active: true // Include only active managers
          }
        },
        ...user_pipelines,
        {
          $addFields: {
            ...pipeline_created_at
          }
        }
      ]
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.USER, // Collection for employees
      localField: 'employee',
      foreignField: '_id',
      as: 'employee',
      pipeline: [
        {
          $match: {
            is_active: true // Include only active managers
          }
        },
        ...user_pipelines,
        {
          $addFields: {
            ...pipeline_created_at
          }
        }
      ]
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.USER, // Collection for managers
      localField: 'manager',
      foreignField: '_id',
      as: 'manager',
      pipeline: [
        {
          $match: {
            is_active: true // Include only active managers
          }
        },
        ...user_pipelines,
        {
          $addFields: {
            ...pipeline_created_at
          }
        }
      ]
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.USER, // Collection for createdUser
      localField: 'createdUser',
      foreignField: '_id',
      as: 'createdUser',
      pipeline: [
        {
          $match: {
            is_active: true // Include only active managers
          }
        },
        ...user_pipelines,
        {
          $addFields: {
            ...pipeline_created_at
          }
        }
      ]
    }
  },
  {
    $addFields: {
      createdUser: {
        $let: {
          vars: {
            activeCreatedUser: {
              $filter: {
                input: '$createdUser', // Array from the $lookup
                as: 'user', // Alias for each item in the array
                cond: { $eq: ['$$user.is_active', true] } // Condition: is_active === true
              }
            }
          },
          in: { $arrayElemAt: ['$$activeCreatedUser', 0] } // Get the first matching user or null
        }
      }
    }
  },
  {
    $addFields: {
      ...pipeline_created_at
    }
  }
];
