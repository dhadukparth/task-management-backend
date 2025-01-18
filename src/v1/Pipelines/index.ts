export * as teamPipelines from './team-pipelines';
export * as userPipelines from './user-pipelines';
export * as rolePipelines from './role-pipelines';

export const pipeline_created_at = {
  created_at: {
    $dateToString: {
      format: '%Y-%m-%d %H:%M:%S',
      date: { $toDate: '$created_at' } // Convert `created_at` timestamp to a formatted string
    }
  }
};

export const pipeline_birth_date = {
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
};

export const pipeline_active_status = {
  $cond: [
    { $eq: ['$is_active', true] },
    { label: 'Active', value: true },
    { label: 'InActive', value: false }
  ]
};
