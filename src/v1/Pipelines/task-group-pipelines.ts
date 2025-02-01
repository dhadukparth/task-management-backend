import { MODEL_COLLECTION_LIST } from '../constant';

export const taskGroup_pipeline = [
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.PROJECT,
      localField: 'projectId',
      foreignField: '_id',
      as: 'project'
    }
  },
  {
    $addFields: {
      project: { $arrayElemAt: ['$project', 0] }
    }
  },
  {
    $addFields: {
      'project.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$project.created_at' }
        }
      }
    }
  },
  {
    $unwind: '$group'
  },
  {
    $unwind: '$labels'
  },
  {
    $addFields: {
      'group.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$group.created_at' }
        }
      },
      'group.updated_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$group.updated_at' }
        }
      },
      'labels.created_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$labels.created_at' }
        }
      },
      'labels.updated_at': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$labels.updated_at' }
        }
      }
    }
  },
  {
    $group: {
      _id: '$_id',
      project: { $first: '$project' },
      group: { $push: '$group' },
      labels: { $push: '$labels' }
    }
  }
];
