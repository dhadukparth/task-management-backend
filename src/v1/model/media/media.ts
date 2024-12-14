import { model, Schema } from 'mongoose';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IMediaModel } from '../../types/model';

const mediaSchema: Schema = new Schema<IMediaModel>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  fileType: {
    type: String,
    enum: ['IMAGE', 'DOCUMENT', 'ICON'],
    required: true
  },
  file: {
    fileName: {
      type: String,
      required: true,
      unique: true
    },
    filePath: {
      type: String,
      required: true
    }
  },
  // uploaded_by: {
  //   type: Schema.Types.ObjectId,
  //   ref: MODEL_COLLECTION_LIST.LOGIN,
  //   required: true
  // },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const MediaModel = model<IMediaModel>(MODEL_COLLECTION_LIST.MEDIA, mediaSchema);
