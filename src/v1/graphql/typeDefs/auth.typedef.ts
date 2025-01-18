import gql from 'graphql-tag';

const authTypes = gql`
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
    changeUserPassword(userData: changeUserPasswordInput): apiBooleanResponseType

    sendVerifyEmail(email: String): apiBooleanResponseType
    verifyEmailAddress(verify: String): apiBooleanResponseType

    sendFPEmail(email: String): apiBooleanResponseType
    resetFPVerify(userData: resetUserPasswordInput): apiBooleanResponseType
  }
`;

const authTypeDefs = gql`
  ${authTypes}
  ${authUserInputTypes}
  ${authUserMutations}
`;

export default authTypeDefs;
