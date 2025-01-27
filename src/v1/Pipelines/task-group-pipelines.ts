import { pipeline_dateFormat } from '.';
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
      'project.created_at': pipeline_dateFormat('$project.created_at')
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
      'group.created_at': pipeline_dateFormat('$group.created_at'),
      'group.updated_at': pipeline_dateFormat('$group.updated_at'),
      'labels.created_at': pipeline_dateFormat('$labels.created_at'),
      'labels.updated_at': pipeline_dateFormat('$labels.updated_at')
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
