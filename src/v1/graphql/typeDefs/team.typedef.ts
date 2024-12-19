import gql from 'graphql-tag';

const teamTypes = gql`
  type teamResponse {
    _id: String
    name: String
    description: String
    is_active: Boolean
    leader: [singleUserResponse]
    employee: [singleUserResponse]
    manager: [singleUserResponse]
    createdUser: singleUserResponse
    technologies: [String]
    created_at: String
    updated_at: String
    deleted_at: DeletedAt
  }

  type singleTeamResponse {
    status: Int
    message: String
    data: teamResponse
    error: String
  }

  type arrayRolesResponseType {
    status: Int
    message: String
    data: [rolesResponse]
    error: String
  }
`;

const teamInputs = gql`
  input teamDataInput {
    name: String!
    description: String!
    leader: [String]!
    employee: [String]
    manager: [String]
    technologies: [String]
    createdUser: String!
  }

  input teamStatusInput {
    teamId: String!
    name: String!
  }
`;

const teamMutations = gql`
  extend type Mutation {
    createTeam(teamData: teamDataInput): singleTeamResponse
    updateTeam(teamId: String!, teamData: teamDataInput): singleTeamResponse
    updateStatusTeam(teamData: teamStatusInput): singleTeamResponse
    tempDeleteTeam(teamData: teamStatusInput): singleTeamResponse
  }
`;

const teamTypeDefs = gql`
  ${teamTypes}
  ${teamInputs}
  ${teamMutations}
`;

export default teamTypeDefs;
