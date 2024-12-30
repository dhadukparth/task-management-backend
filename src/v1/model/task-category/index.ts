import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { ITaskCategory } from '../../types/model';

const taskCategorySchema = new Schema<ITaskCategory>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
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

export const taskCategoryModel = model<ITaskCategory>(MODEL_COLLECTION_LIST.TASK_CATEGORY, taskCategorySchema);
