import { model, Schema } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IFeatureModel } from '../../types/model';

const featureSchema = new Schema<IFeatureModel>({
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
  created_at: {
    type: Number,
    default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC')
  },
  updated_at: {
    type: Date
  }
});

export const featureModel = model<IFeatureModel>(MODEL_COLLECTION_LIST.FEATURES, featureSchema);
