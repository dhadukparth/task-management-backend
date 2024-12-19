import gql from 'graphql-tag';

const userTypes = gql`
  type userPlaceDetails {
    address: String
    location: String
    city: String
    state: String
    country: String
    zip_code: String
  }

  type userRoleData {
    _id: ID
    name: String!
  }

  type userName {
    first_name: String!
    middle_name: String
    last_name: String!
  }

  type userEmail {
    email_address: String!
  }

  type userContact {
    contact_code: String
    contact_number: String
  }

  type placeDetails {
    address: String
    location: String
    city: String
    state: String
    country: String
    zip_code: String
  }

  type singleUserResponse {
    _id: String
    name: userName
    email: userEmail
    contact: userContact
    role: userRoleData
    tag: singleUserTagResponse
    department: departmentResponse
    gender: String
    dob: String
    blood_group: String
    place_details: placeDetails
    created_at: String
    is_active: Boolean
  }

  type loginTokenObject {
    accessToken: String
    refreshToken: String
  }

  type singleLoginResponse {
    status: Int
    message: String
    data: loginTokenObject
    error: String
  }

  type multipleUserResponseType {
    status: Int
    message: String
    data: [singleUserResponse]
    error: String
  }

  type singleUserResponseType {
    status: Int
    message: String
    data: singleUserResponse
    error: String
  }

  type singleUserBooleanResponseType {
    status: Int
    message: String
    data: Boolean
    error: String
  }
`;

const userInputTypes = gql`
  input userCreateInput {
    firstName: String!
    middleName: String!
    lastName: String!
    email: String!
    roleId: String!
    departmentId: String!
    tagId: String!
    contactCode: String
    contactNumber: String
    gender: String
    dob: String
    bloodGroup: String
    address: String
    location: String
    city: String
    state: String
    country: String
    zipCode: String
  }

  input userUpdateInput {
    firstName: String!
    middleName: String!
    lastName: String!
    email: String!
    roleId: String!
    departmentId: String!
    tagId: String!
    contactCode: String!
    contactNumber: String!
    gender: String!
    dob: String!
    bloodGroup: String
    address: String!
    location: String!
    city: String!
    state: String!
    country: String!
    zipCode: String!
  }

  input tempDeleteUserInput {
    email: String
    password: String
  }

  input userLoginInput {
    email: String
    password: String
  }

  input userRecoverInput {
    email: String
    password: String
  }

  input changeUserPasswordInput {
    email: String
    currentPassword: String
    newPassword: String
  }

  input resetUserPasswordInput {
    email: String
    verify_token: String
    newPassword: String
  }
`;

const userQueries = gql`
  extend type Query {
    allUsers: multipleUserResponseType
  }
`;

const userMutations = gql`
  extend type Mutation {
    createUser(userData: userCreateInput): singleUserBooleanResponseType
    updateUser(userData: userUpdateInput): singleUserBooleanResponseType
    activeUserStatus(email: String): singleUserBooleanResponseType
    tempDeleteUser(userData: tempDeleteUserInput): singleUserBooleanResponseType
    recoverDeleteUser(userData: userRecoverInput): singleUserBooleanResponseType
    changeUserPassword(userData: changeUserPasswordInput): singleUserBooleanResponseType

    sendVerifyEmail(email: String): singleUserBooleanResponseType
    verifyEmailAddress(verify: String): singleUserBooleanResponseType

    sendResetVerifyKeyUserPassword(email: String): singleUserBooleanResponseType
    resetUserPassword(userData: resetUserPasswordInput): singleUserBooleanResponseType

    userLogin(userData: userLoginInput): singleLoginResponse
  }
`;

const userTypeDefs = gql`
  ${userTypes}
  ${userInputTypes}
  ${userQueries}
  ${userMutations}
`;

export default userTypeDefs;
