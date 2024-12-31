import { MODEL_COLLECTION_LIST } from '../constant';

export const user_pipelines = [
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.ROLES, // The collection name for roles
      localField: 'role', // The field in the users collection that holds the ObjectId
      foreignField: '_id', // The field in tbl_roles to match with role
      as: 'role' // The output array field for matched role documents
    }
  },
  {
    $addFields: {
      role: {
        $let: {
          vars: {
            activeRoles: {
              $filter: {
                input: '$role', // The role array from the $lookup
                as: 'roleItem', // Alias for each item in the array
                cond: { $eq: ['$$roleItem.is_active', true] } // Condition: is_active === true
              }
            }
          },
          in: {
            $cond: {
              if: { $gt: [{ $size: '$$activeRoles' }, 0] }, // Check if there are any active roles
              then: { $arrayElemAt: ['$$activeRoles', 0] }, // Return the first active role
              else: null // Return false if no active roles are found
            }
          }
        }
      }
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.DEPARTMENT,
      localField: 'department',
      foreignField: '_id',
      as: 'department'
    }
  },
  {
    $addFields: {
      department: {
        $let: {
          vars: {
            activeDepartments: {
              $filter: {
                input: '$department', // The department array from the $lookup
                as: 'departmentItem', // Alias for each item in the array
                cond: { $eq: ['$$departmentItem.is_active', true] } // Condition: is_active === true
              }
            }
          },
          in: {
            $cond: {
              if: { $gt: [{ $size: '$$activeDepartments' }, 0] },
              then: { $arrayElemAt: ['$$activeDepartments', 0] }, // Get the first matching active department or null
              else: null // Return false if no active departments are found
            }
          }
        }
      }
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.USER_TAGS,
      localField: 'tag',
      foreignField: '_id',
      as: 'tag'
    }
  },
  {
    $addFields: {
      tag: {
        $let: {
          vars: {
            activeTags: {
              $filter: {
                input: '$tag', // The tag array from the $lookup
                as: 'tagItem', // Alias for each item in the array
                cond: { $eq: ['$$tagItem.is_active', true] } // Condition: is_active === true
              }
            }
          },
          in: { 
            $cond: {
              if: { $gt: [{ $size: '$$activeTags' }, 0] }, // Check if there are any active roles
              then: { $arrayElemAt: ['$$activeTags', 0] }, // Return the first active role
              else: null // Return false if no active roles are found
            } 
          }
        }
      }
    }
  },
  {
    $addFields: {
      created_at: {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
        }
      },
      dob: {
        $cond: {
          if: { $eq: ['$dob', null] }, // Check if `dob` is null
          then: '', // Set to an empty string if null
          else: {
            $dateToString: {
              format: '%Y-%m-%d', // Format the date as YYYY-MM-DD
              date: { $toDate: '$dob' } // Convert `dob` timestamp to a date
            }
          }
        }
      }
    }
  }
];
