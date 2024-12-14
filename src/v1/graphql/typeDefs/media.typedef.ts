import gql from 'graphql-tag';

const mediaType = gql`
  type FileObjectType {
    fileName: String
    filePath: String
  }

  type MediaDataResponse {
    _id: String
    name: String
    description: String
    fileType: String
    file: FileObjectType
    created_at: String
  }

  type SingleMediaResponseType {
    status: Int
    message: String
    data: MediaDataResponse
    error: String
  }

  type AllMediaResponseType {
    status: Int
    message: String
    data: [MediaDataResponse]
    error: String
  }
`;

const mediaInputTypes = gql`
  enum FileType {
    ICON
    IMAGE
    DOCUMENT
  }

  input MediaUploadInput {
    name: String
    description: String
    fileType: FileType
  }

  input MediaDeleteInput {
    id: String
    name: String
  }
`;

const mediaQueries = gql`
  type Query {
    getAllMedia: AllMediaResponseType
    getSingleMedia(mediaData: MediaDeleteInput): SingleMediaResponseType
  }
`;

const mediaMutations = gql`
  scalar Upload
  type Mutation {
    singleUploadMedia(uploadFile: Upload!, mediaData: MediaUploadInput): SingleMediaResponseType
    deleteMedia(mediaData: MediaDeleteInput): SingleMediaResponseType
  }
`;

const mediaTypeDefs = gql`
  ${mediaType}
  ${mediaInputTypes}
  ${mediaQueries}
  ${mediaMutations}
`;

export default mediaTypeDefs;
