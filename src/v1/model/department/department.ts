import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IDepartment } from '../../types/model';

const departmentSchema = new Schema<IDepartment>({
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
  }
});

export const departmentModel = model<IDepartment>(
  MODEL_COLLECTION_LIST.DEPARTMENT,
  departmentSchema
);
