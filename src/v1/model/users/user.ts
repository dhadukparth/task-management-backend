import { Schema, model } from 'mongoose';
import DateTimeUtils from '../../../helper/moment';
import { MODEL_COLLECTION_LIST } from '../../constant';
import { IUser } from '../../types/model';

const UserSchema: Schema = new Schema<IUser>({
  name: {
    first_name: {
      type: String,
      required: true,
      lowercase: true
    },
    middle_name: {
      type: String,
      required: true,
      lowercase: true
    },
    last_name: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  email: {
    email_address: {
      type: String,
      required: true,
      unique: true,
      default: null
    },
    verify: {
      type: Boolean,
      default: false
    },
    verify_key: {
      type: String,
      default: null
    }
  },
  contact: {
    contact_code: {
      type: String,
      default: null
    },
    contact_number: {
      type: String,
      default: null
    }
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.ROLES,
    required: true
  },
  tag: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.USER_TAGS,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.DEPARTMENT,
    required: true
  },
  profile_picture: {
    type: Schema.Types.ObjectId,
    ref: MODEL_COLLECTION_LIST.MEDIA,
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  dob: {
    type: Number,
    default: null
  },
  blood_group: {
    type: String,
    default: null
  },
  place_details: {
    address: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    zip_code: {
      type: String,
      default: null
    }
  },
  social_media: [
    {
      title: {
        type: String,
        default: null
      },
      url: {
        type: String,
        default: null
      }
    }
  ],
  credentials: {
    user_key: {
      type: String,
      required: true,
      select: false,
      unique: true
    },
    password: {
      type: String,
      required: true,
      default: null,
      select: false
    },
    otp: {
      type: String,
      default: null,
      select: false
    },
    secretKey: {
      type: String,
      default: null,
      select: false
    },
  },
  last_login: [
    {
      date: {
        type: Number,
        default: DateTimeUtils.convertToUTC(DateTimeUtils.getToday(), 'UTC'),
        select: false
      },
      system: {
        device_type: {
          type: String,
          enum: ['WEB', 'ANDROID'],
          default: 'WEB',
          select: false
        },
        device_id: {
          type: String,
          default: null,
          select: false
        }
      },
      token: {
        auth_token: {
          type: String,
          default: null,
          select: false
        },
        refresh_token: {
          type: String,
          default: null,
          select: false
        }
      }
    }
  ],
  is_active: {
    type: Boolean,
    default: true
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

export const userModel = model<IUser>(MODEL_COLLECTION_LIST.USER, UserSchema);
