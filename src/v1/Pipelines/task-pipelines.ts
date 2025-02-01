import { MODEL_COLLECTION_LIST } from '../constant';

export const taskList_pipeline = [
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.PROJECT,
      localField: 'project_id',
      foreignField: '_id',
      as: 'project',
      pipeline: [
        {
          $match: {
            is_active: true
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
            'date.start_date': {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: {
                  $toDate: '$date.start_date'
                }
              }
            },
            'date.end_date': {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: {
                  $toDate: '$date.end_date'
                }
              }
            }
          }
        }
      ]
    }
  },
  {
    $unwind: '$project'
  },
  {
    $unwind: '$task_list'
  },
  {
    $addFields: {
      'task_list.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: {
            $toDate: '$task_list.created_at'
          }
        }
      },
      'task_list.updated_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: {
            $toDate: '$task_list.updated_at'
          }
        }
      },
      'task_list.date.start_date': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: {
            $toDate: '$task_list.date.start_date'
          }
        }
      },
      'task_list.date.end_date': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: {
            $toDate: '$task_list.date.end_date'
          }
        }
      },
      'task_list.deleted_at.date': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: {
            $toDate: '$task_list.deleted_at.date'
          }
        }
      },
      'task_list.is_active': {
        $cond: {
          if: { $eq: ['$is_active', true] },
          then: {
            label: 'active',
            value: '$task_list.is_active'
          },
          else: {
            label: 'in active',
            value: '$task_list.is_active'
          }
        }
      }
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.TASK_GROUP,
      localField: 'task_list.group_id',
      foreignField: 'group._id',
      as: 'task_group'
    }
  },
  {
    $unwind: '$task_group'
  },
  {
    $unwind: '$task_group.group'
  },
  {
    $match: {
      $expr: {
        $eq: ['$task_list.group_id', '$task_group.group._id']
      }
    }
  },
  {
    $addFields: {
      'task_group.group.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$task_group.group.created_at' }
        }
      },
      'task_group.group.updated_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$task_group.group.updated_at' }
        }
      }
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.TASK_GROUP,
      localField: 'task_list.label_id',
      foreignField: 'labels._id',
      as: 'task_labels'
    }
  },
  {
    $unwind: '$task_labels'
  },
  {
    $unwind: '$task_labels.labels'
  },
  {
    $match: {
      $expr: {
        $in: ['$task_labels.labels._id', '$task_list.label_id']
      }
    }
  },
  {
    $addFields: {
      'task_labels.labels.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$task_labels.labels.created_at' }
        }
      },
      'task_labels.labels.updated_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$task_labels.labels.updated_at' }
        }
      }
    }
  },
  {
    $group: {
      _id: '$task_list._id',
      project: { $first: '$project' },
      name: { $first: '$task_list.name' },
      description: {
        $first: '$task_list.description'
      },
      is_active: {
        $first: '$task_list.is_active'
      },
      date: {
        $first: {
          startDate: '$task_list.date.start_date',
          endDate: '$task_list.date.end_date'
        }
      },
      group: { $first: '$task_group.group' },
      assignUser: {
        $first: '$task_list.user_assign'
      },
      labels: { $push: '$task_labels.labels' },
      created_at: {
        $first: '$task_list.created_at'
      },
      updated_at: {
        $first: '$task_list.updated_at'
      },
      deleted_at: {
        $first: '$task_list.deleted_at'
      }
    }
  }
];
