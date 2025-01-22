import { MODEL_COLLECTION_LIST } from '../constant';
import { team_pipelines } from './team-pipelines';
import { user_pipelines } from './user-pipelines';

export const project_pipelines = [
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.TEAM,
      localField: 'teamId',
      foreignField: '_id',
      as: 'team',
      pipeline: [...team_pipelines]
    }
  },
  {
    $lookup: {
      from: MODEL_COLLECTION_LIST.USER,
      localField: 'ownerId',
      foreignField: '_id',
      as: 'owner',
      pipeline: [...user_pipelines]
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
          date: { $toDate: '$date.start_date' }
        }
      },
      'date.end_date': {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: { $toDate: '$date.end_date' }
        }
      },
      team: { $arrayElemAt: ['$team', 0] },
      owner: { $arrayElemAt: ['$owner', 0] }
    }
  }
];
