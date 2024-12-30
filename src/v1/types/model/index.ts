import mongoose, { Date, Document } from 'mongoose';
import { ApolloFileType } from '../../services/upload';

export interface IPermissionModel extends Document {
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: {
    date: Date | null;
    user_id: mongoose.Types.ObjectId;
  };
}

export interface IFeatureModel extends Document {
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface IRolesModel extends Document {
  name: string;
  description: string;
  access_control: {
    feature_id: string;
    permission_id: string[];
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: {
    date: Date | null;
    user_id: mongoose.Types.ObjectId;
  };
}

export interface IMediaModel extends Document {
  name: string;
  fileType: ApolloFileType;
  uploaded_by: mongoose.Types.ObjectId;
  file: {
    fileName: string;
    filePath: string;
  };
  description: string;
  created_at: Date;
  deleted_at: {
    date: Date | null;
    user_id: string;
  };
}

export interface ISocialMedialModel extends Document {
  name: string;
  url: string;
  icon: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
}

export interface IDepartment extends Document {
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface IUserTags extends Document {
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export interface ILoginModel extends Document {
  first_name: string;
  last_name: string;
  email_address: string;
  username: string;
  role_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: {
    date: Date | null;
    user_id: string;
  };
}

export interface ICredentialsModel extends Document {
  user_id: mongoose.Types.ObjectId;
  password: string;
  apiKey: string;
  otp: string | null;
  tokens: {
    auth_token: string;
    refresh_token: string;
  };
}

// NOTE: User Authentication
export interface IUser extends Document {
  name: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
  email: {
    email_address: string;
    verify: boolean;
    verify_key: string;
  };
  contact: {
    contact_code: string | null;
    contact_number: string | null;
  };
  role: mongoose.Types.ObjectId;
  tag: mongoose.Types.ObjectId;
  department: mongoose.Types.ObjectId;
  profile_picture: mongoose.Types.ObjectId | null;
  is_active: boolean;
  gender: string | null;
  dob: number | null;
  blood_group: string | null;
  place_details: {
    address: string | null;
    location: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zip_code: string | null;
  };
  credentials: {
    user_key: string;
    password: string;
    otp: string | null;
    secretKey: string | null;
  };
  social_media:
    | {
        title: string;
        url: string;
      }[]
    | null;
  last_login:
    | {
        date: number;
        system: {
          device_type: 'WEB' | 'ANDROID';
          device_id: string;
        };
        tokens: {
          auth_token: string;
          refresh_token: string;
        };
      }[]
    | null;
  created_at?: number;
  updated_at?: number | null;
  deleted_at?: number | null;
}

export interface ITeam extends Document {
  name: string;
  description: string;
  leader: string[];
  employee: string[];
  createdUser: mongoose.Types.ObjectId;
  image: mongoose.Types.ObjectId | null;
  manager: mongoose.Types.ObjectId;
  technologies: string[];
  is_active: boolean;
  created_at: number;
  updated_at: number | null;
  deleted_at: number | null;
}

export interface ITaskCategory extends Document {
  name: string;
  description: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}

export interface ITaskGroup extends Document {
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}

export interface IProjectModel extends Document {
  name: string;
  description: string;
  ownerId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  date: {
    start_date: number;
    end_date: number;
  };
  is_active: boolean;
  created_at: number;
  updated_at: number;
  deleted_at: {
    date: number | null;
    user_id: mongoose.Types.ObjectId | null;
  };
}
