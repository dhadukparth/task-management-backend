import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IUserTags } from '../../types/model';

const userTagsSchema = new Schema<IUserTags>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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
  created_at: {
    type: Number,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  },
  updated_at: {
    type: Date,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  }
});

export const userTagsModel = model<IUserTags>(
  MODEL_COLLECTION_LIST.USER_TAGS,
  userTagsSchema
);
