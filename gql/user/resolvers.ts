import { GraphQLError } from 'graphql';
import Models from '../../models';

export const resolvers = {
  Query: {
    getUser: () => {}
  },
  Mutation: {
    createUpdateUser: async (parent, args, context, info) => {
      try {
        const { user: payload } = context;

        const existingUser = await Models.UserModel.findOne({ uid: payload.uid });
  
        if (existingUser) {
          existingUser.uid = payload.uid;
          existingUser.email = payload.email;
          existingUser.role = payload.role;

          await existingUser.save();
          return existingUser;
        }

        const user = await Models.UserModel.create({
            ...payload
        });

        return user;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    deleteUser: async (parent, args, context, info) => {
        try {
          const { user } = context;
          const { uid } = args;

          if(user.uid !== uid) {
            throw new GraphQLError ('Access Denied');
          }
  
          const existingUser = await Models.UserModel.findOne({ uid });
    
          if (!existingUser) {
            throw new GraphQLError ('No user found');
          }
          
          await existingUser.remove();

          return existingUser;
        } catch (error) {
          console.log(error);
          throw new GraphQLError(error?.message);
        }
    },
  },
};
