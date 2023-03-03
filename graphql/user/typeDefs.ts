export const typeDefs = `#graphql
  type Slang {
    _id: ID
    title: String
    description: String
    submittedById: String
    likes: Int
    status: String
    usage: [String]
  }

  type Query {
    getEverything: [Slang]
    getSlang (id: String): Slang
    getTrending: [Slang]
  }

`;