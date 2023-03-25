export const typeDefs = `#graphql
type Slang {
  _id: ID
  title: String
  description: String
  submittedById: String
  likes: Int
  status: String
  usage: [String]
  additionalInfo: [String]
}

input CreateSlangInput {
  title: String
  description: String
  usage: [String]
}

input UpdateSlangInput {
  _id: ID
  title: String
  description: String
  submittedById: String
  status: String
  usage: [String]
}

type Mutation {
  createSlang(data: CreateSlangInput): Slang
  updateSlang(data: UpdateSlangInput): Slang
}

type Query {
  deleteSlang(id: String): Slang
  likeSlang(id: String): Slang
  bookmarkSlang(id: String): Slang
  getSavedSlangs: [Slang]
  getUserSlangs: [Slang]
}

`;