import { GraphQLError } from 'graphql';
import Models from '../../models';

export const resolvers = {
  Query: {
    getEverything: async (parent, args, context, info) => {
      try {
        const slangs = await Models.SlangModel.find({
          /* status: 'approved',*/
        }).sort({
          title: 1,
        });

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },

    getSlang: async (parent, args, context, info) => {
      try {
        const { id } = args;
        const slang = await Models.SlangModel.findOne({ _id: id });

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },

    getTrending: async (parent, args, context, info) => {
      try {
        const { id, page, size } = args;
        const slangs = await Models.SlangModel.find({ _id: id }).sort({ likes: -1 });

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
  },
};
