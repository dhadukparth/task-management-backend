import mongoose from 'mongoose';
import { ApolloFileType } from '../../services/upload';

type ApiResponseType = {
  status: number;
  message: string;
  data: boolean;
}

export interface IActionResponse {
  create: ApiResponseType;
  update: ApiResponseType;
  delete: ApiResponseType;
}

type CreateLogin = {
  first_name: string;
  last_name: string;
  email_address: string;
  username: string;
  role_id: mongoose.Types.ObjectId;
};

type DeleteLogin = {
  deleted_id: string;
  user_id: mongoose.Types.ObjectId;
};

// TODO: Define IActionLogin Interface and types
export interface IActionLogin {
  create_login: CreateLogin;
  delete_login: DeleteLogin;
}

type CreatePermission = {
  name: string;
  description: string;
};

type SinglePermission = {
  id: string;
};

type UpdatePermission = {
  id: string;
  name: string;
  description: string;
};

type UpdateStatusPermission = {
  id: string;
  status: boolean;
};

type TempDeletePermission = {
  id: string;
};

type RollBackTempDeletePermission = {
  id: string;
  name: string;
};

// TODO: Define IActionPermission Interface and types
export interface IActionPermission {
  create_permission: CreatePermission;
  update_permission: UpdatePermission;
  update_status_permission: UpdateStatusPermission;
  single_permission: SinglePermission;
  temp_delete_permission: TempDeletePermission;
  roll_back_permission: RollBackTempDeletePermission;
  roll_back_delete_permission: RollBackTempDeletePermission;
}

type AccessControlsType = {
  feature_id: string;
  permission_id: string[];
};

type CreateRoles = {
  name: string;
  description: string;
  accessControl: AccessControlsType[];
};

type SingleRoles = {
  id: string;
  name: string;
};

type UpdateRoles = {
  id: string;
  name: string;
  description: string;
  accessControl: AccessControlsType[];
};

type UpdateStatusRoles = {
  id: string;
  status: boolean;
};

type TempDeleteRoles = {
  id: string;
};

type RollBackTempDeleteRoles = {
  id: string;
  name: string;
};

// TODO: Define IActionPermission Interface and types
export interface IActionRoles {
  create_roles: CreateRoles;
  update_roles: UpdateRoles;
  update_status_roles: UpdateStatusRoles;
  single_roles: SingleRoles;
  temp_delete_roles: TempDeleteRoles;
  roll_back_roles: RollBackTempDeleteRoles;
  permanently_delete_roles: RollBackTempDeleteRoles;
}

type CreateFeature = {
  name: string;
  description: string;
};

type SingleFeature = {
  id: string;
};

type UpdateFeature = {
  id: string;
  name: string;
  description: string;
};

type PermanentlyDeleteFeature = {
  id: string;
  name: string;
};

// TODO: Define IActionFeature Interface and types
export interface IActionFeature {
  create_feature: CreateFeature;
  single_feature: SingleFeature;
  update_feature: UpdateFeature;
  permanently_delete_feature: PermanentlyDeleteFeature;
}

type CreateDepartment = {
  name: string;
  description: string;
};

type SingleDepartment = {
  id: string;
};

type UpdateDepartment = {
  id: string;
  name: string;
  description: string;
};

type UpdateStatusDepartment = {
  id: string;
  status: boolean;
};

type PermanentlyDeleteDepartment = {
  id: string;
  name: string;
};

// TODO: Define IActionPermission Interface and types
export interface IActionDepartment {
  create_department: CreateDepartment;
  single_department: SingleDepartment;
  update_department: UpdateDepartment;
  update_status_department: UpdateStatusDepartment;
  permanently_delete_department: PermanentlyDeleteDepartment;
}

type CreateUserTag = {
  name: string;
  description: string;
};

type SingleUserTag = {
  id: string;
};

type UpdateUserTag = {
  id: string;
  name: string;
  description: string;
};

type UpdateStatusUserTag = {
  id: string;
  status: boolean;
};

type PermanentlyDeleteUserTag = {
  id: string;
  name: string;
};

// TODO: Define IActionPermission Interface and types
export interface IActionUserTag {
  create_user_tag: CreateUserTag;
  single_user_tag: SingleUserTag;
  update_user_tag: UpdateUserTag;
  update_status_user_tag: UpdateStatusUserTag;
  permanently_delete_user_tag: PermanentlyDeleteUserTag;
}

type UploadFileMedia = {
  name: string;
  description: string;
  fileType: ApolloFileType;
  file: {
    fileName: string;
    filePath: string;
  };
};

type SingleMedia = {
  id: string;
  name: string;
};

// TODO: Define IActionMedia Interface and types
export interface IActionMedia {
  upload_file: UploadFileMedia;
  single_file: SingleMedia;
  delete_file: SingleMedia;
}

type UpdateUserType = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  contact_code: string;
  contact_number: string;
  role: string;
  tag: string;
  department: string;
  place: {
    address: string;
    location: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  };
  gender?:string;
  dob?:string;
  blood_group?:string;
  password: string;
  last_login: {
    date: string | number;
    device_type: 'WEB' | 'ANDROID';
    device_id: string;
  };
};

type TempDeleteUserType = {
  user_key: string;
  password: string;
  email: string;
}

type RecoverDeleteUserType = {
  password: string;
  email: string;
}

export interface IUserAction {
  create_user: UpdateUserType;
  update_user: UpdateUserType;
  temp_delete_user: TempDeleteUserType;
  recover_delete_user: RecoverDeleteUserType;
}
