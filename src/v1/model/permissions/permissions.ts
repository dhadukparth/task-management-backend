import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IPermissionModel } from '../../types/model';

const permissionsSchema = new Schema<IPermissionModel>({
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
    type: Date
  },
  deleted_at: {
    date: {
      type: String,
      default: null
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: MODEL_COLLECTION_LIST.LOGIN,
      default: null
    }
  }
});

export const permissionsModel = model<IPermissionModel>(
  MODEL_COLLECTION_LIST.PERMISSION,
  permissionsSchema
);
