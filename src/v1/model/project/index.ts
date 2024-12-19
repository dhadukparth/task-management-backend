import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IProjectModel } from '../../types/model';

const projectSchema = new Schema<IProjectModel>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.USER,
    required: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.TEAM,
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
  is_active: {
    type: Boolean, // TODO: true is active and false is in-active
    required: true,
    default: true
  },
  created_at: {
    type: Number,
    required: true,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  },
  updated_at: {
    type: Number,
    default: null
  },
  deleted_at: {
    date: {
      type: String,
      default: null
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: MODEL_COLLECTION_LIST.USER,
      default: null
    }
  }
});

export const projectModel = model<IProjectModel>(MODEL_COLLECTION_LIST.PROJECT, projectSchema);
