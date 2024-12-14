import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IRolesModel } from '../../types/model';

const rolesSchema = new Schema<IRolesModel>({
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
  access_control: [
    {
      feature_id: {
        type: Schema.Types.ObjectId,
        ref: MODEL_COLLECTION_LIST.FEATURES,
        required: true,
        unique: true
      },
      permission_id: [
        {
          type: Schema.Types.ObjectId,
          ref: MODEL_COLLECTION_LIST.PERMISSION,
          required: true,
          unique: true
        }
      ]
    }
  ],
  is_active: {
    type: Boolean, // TODO: true or 0 is active and false or 1 is in-active
    required: true,
    default: true
  },
  created_at: {
    type: Number,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  },
  updated_at: {
    type: Date,
    default: null
  },
  deleted_at: {
    date: {
      type: Date,
      default: null
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: MODEL_COLLECTION_LIST.LOGIN,
      default: null
    }
  }
});

export const rolesModel = model<IRolesModel>(MODEL_COLLECTION_LIST.ROLES, rolesSchema);
