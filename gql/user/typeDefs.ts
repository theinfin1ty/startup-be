export const typeDefs = `#graphql
  type User {
    _id: ID
    uid: String
    role: String
    email: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    createUpdateUser: User
    deleteUser (id: String): User
  }
`;