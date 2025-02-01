import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { ITaskModel } from '../../types/model';

const taskSchema = new Schema<ITaskModel>({
  project_id: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.PROJECT,
    required: true
  },
  task_list: [
    {
      name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
      },
      description: {
        type: String
      },
      label_id: [
        {
          type: Schema.Types.ObjectId,
          ref: MODEL_COLLECTION_LIST.TASK_GROUP,
          required: true
        }
      ],
      group_id: {
        type: Schema.Types.ObjectId,
        ref: MODEL_COLLECTION_LIST.TASK_GROUP,
        required: true
      },
      user_assign: {
        type: Schema.Types.ObjectId,
        ref: MODEL_COLLECTION_LIST.USER,
        required: true
      },
      // TODO: true or 0 is active and false or 1 is in-active
      is_active: {
        type: Boolean,
        default: true,
        required: true
      },
      date: {
        start_date: {
          type: Number,
          required: true
        },
        end_date: {
          type: Number,
          required: true
        }
      },
      created_at: {
        type: Number,
        required: true,
        default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
      },
      updated_at: {
        type: Number,
        required: true,
        default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
      },
      deleted_at: {
        date: {
          type: Number,
          default: null
        },
        user_id: {
          type: Schema.Types.ObjectId,
          default: null
        }
      }
    }
  ],
  created_at: {
    type: Number,
    required: true,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  },
  deleted_at: {
    date: {
      type: Number,
      default: null
    },
    user_id: {
      type: Schema.Types.ObjectId,
      default: null
    }
  }
});

export const taskListModel = model<ITaskModel>(MODEL_COLLECTION_LIST.TASK, taskSchema);
