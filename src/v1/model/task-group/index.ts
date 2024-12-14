import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { ITaskGroup } from '../../types/model';

const taskGroupSchema = new Schema<ITaskGroup>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean, // TODO: true is active and false is in-active
    required: true,
    default: true
  },
  //   createdBy: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: true
  //   },
  created_at: {
    type: Number,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  },
  updated_at: {
    type: Number,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  }
});

export const taskGroupModel = model<ITaskGroup>(MODEL_COLLECTION_LIST.TASK_GROUP, taskGroupSchema);
