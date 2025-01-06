import { MODEL_COLLECTION_LIST } from "../constant";

export const rolesList_pipeline = [
  {
    $unwind: '$access_control' // Unwind the access_control array to process each element individually
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.FEATURES, // The collection containing feature data
      localField: 'access_control.feature_id', // The field from the roles collection
      foreignField: '_id', // The field from the features collection
      as: 'featureDetails' // The name of the field to store the joined data
    }
  },
  {
    $unwind: '$featureDetails' // Unwind the featureDetails array if there's a one-to-one mapping
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.PERMISSION, // The collection containing permission data
      localField: 'access_control.permission_id', // The field in the access_control object
      foreignField: '_id', // The field in the permissions collection
      as: 'permissionDetails' // The name of the field to store the joined data
    }
  },
  {
    $addFields: {
      created_at: {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$created_at' }
        }
      },
      'featureDetails.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$featureDetails.created_at' }
        }
      },
      'permissionDetails.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$featureDetails.created_at' }
        }
      }
    }
  },
  {
    $group: {
      _id: '$_id', // Group by the role's ID
      name: { $first: '$name' },
      is_active: { $first: '$is_active' },
      created_at: { $first: '$created_at' },
      access_control: {
        $push: {
          feature: {
            _id: '$featureDetails._id',
            name: '$featureDetails.name',
            description: '$featureDetails.description',
            created_at: '$featureDetails.created_at'
          },
          permissions: '$permissionDetails'
        }
      }
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      is_active: 1,
      created_at: 1,
      access_control: {
        $map: {
          input: '$access_control',
          as: 'ac',
          in: {
            features: '$$ac.feature',
            permissions: {
              $reduce: {
                input: '$access_control',
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this.permissions'] }
              }
            }
          }
        }
      }
    }
  }
];
