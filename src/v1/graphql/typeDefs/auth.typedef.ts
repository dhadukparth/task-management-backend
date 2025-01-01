import gql from 'graphql-tag';

const authTypes = gql`
  type singleLoginResponse {
    status: Int
    message: String
    data: loginTokenObject
    error: String
  }

  type singleUserBooleanResponseType {
    status: Int
    message: String
    data: Boolean
    error: String
  }
`;

const authUserInputTypes = gql`
  input userLoginInput {
    email: String!
    password: String!
  }

  input resetUserPasswordInput {
    email: String!
    verify_token: String!
    newPassword: String
  }

  input changeUserPasswordInput {
    email: String!
    currentPassword: String!
    newPassword: String!
  }
`;

const authUserMutations = gql`
  extend type Mutation {
    userLogin(userData: userLoginInput): singleLoginResponse
    changeUserPassword(userData: changeUserPasswordInput): singleUserBooleanResponseType

    sendVerifyEmail(email: String): singleUserBooleanResponseType
    verifyEmailAddress(verify: String): singleUserBooleanResponseType

    sendResetVerifyKeyUserPassword(email: String): singleUserBooleanResponseType
    resetUserPassword(userData: resetUserPasswordInput): singleUserBooleanResponseType
  }
`;

const authTypeDefs = gql`
  ${authTypes}
  ${authUserInputTypes}
  ${authUserMutations}
`;

export default authTypeDefs;
