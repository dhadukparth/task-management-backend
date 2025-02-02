import gql from 'graphql-tag';

const mediaType = gql`
  type FileObjectType {
    fileType: String
    fileName: String
    filePath: String
  }

  type MediaDataResponse {
    _id: String
    name: String
    description: String
    file: FileObjectType
    created_at: String
  }

  type createSingleMediaUpload {
    fileId: String
    fileName: String
  }

  type apiSingleUploadMediaResponse {
    status: Int
    message: String
    data: createSingleMediaUpload
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
`;

const mediaQueries = gql`
  type Query {
    getAllMedia: AllMediaResponseType
    getSingleMedia(fileId: String, name: String): SingleMediaResponseType
  }
`;

const mediaMutations = gql`
  type Mutation {
    singleUploadMedia(
      uploadFile: Upload!
      mediaData: MediaUploadInput
    ): apiSingleUploadMediaResponse
    deleteMedia(fileId: String!, name: String!): apiBooleanResponseType
  }
`;

const mediaTypeDefs = gql`
  ${mediaType}
  ${mediaInputTypes}
  ${mediaQueries}
  ${mediaMutations}
`;

export default mediaTypeDefs;
