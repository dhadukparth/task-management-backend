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

  type multipleTeamResponse {
    status: Int
    message: String
    data: [teamResponse]
    error: String
  }
`;

const teamInputs = gql`
  input teamDataInput {
    name: String!
    description: String!
    leader: [String]!
    createdUser: String!
    employee: [String]
    manager: [String]
    technologies: [String]
  }

  input teamStatusInput {
    teamId: String!
    name: String!
  }
`;

const teamQuery = gql`
  extend type Query {
    getAllTeams: multipleTeamResponse
    getSingleTeams(teamId: String!, name: String!): singleTeamResponse
  }
`;

const teamMutations = gql`
  extend type Mutation {
    createTeam(teamData: teamDataInput): apiBooleanResponseType
    updateTeam(teamId: String!, teamData: teamDataInput): apiBooleanResponseType
    updateStatusTeam(teamData: teamStatusInput): apiBooleanResponseType
    tempDeleteTeam(teamData: teamStatusInput): apiBooleanResponseType
  }
`;

const teamTypeDefs = gql`
  ${teamTypes}
  ${teamInputs}
  ${teamQuery}
  ${teamMutations}
`;

export default teamTypeDefs;
