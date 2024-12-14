import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { ITeam } from '../../types/model';

const TeamSchema: Schema = new Schema<ITeam>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  leader: [
    {
      type: Schema.Types.ObjectId,
      ref: MODEL_COLLECTION_LIST.USER,
      required: true
    }
  ],
  employee: [
    {
      type: Schema.Types.ObjectId,
      ref: MODEL_COLLECTION_LIST.USER,
      required: true
    }
  ],
  manager: [
    {
      type: Schema.Types.ObjectId,
      ref: MODEL_COLLECTION_LIST.USER,
      required: true
    }
  ],
  technologies: [
    {
      type: String,
      required: true
    }
  ],
  image: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.MEDIA,
    default: null
  },
  createdUser: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.USER,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true,
    required: true
  },
  created_at: {
    type: Number,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
    required: true
  },
  updated_at: {
    type: Number,
    default: null
  },
  deleted_at: {
    type: Number,
    default: null
  }
});

export const teamModel = model<ITeam>(MODEL_COLLECTION_LIST.TEAM, TeamSchema);
