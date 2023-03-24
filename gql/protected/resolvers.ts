import { GraphQLError } from 'graphql';
import Models from '../../models';

export const resolvers = {
  Mutation: {
    createSlang: async (parent, args, context, info) => {
      try {
        const { title, description, usage, additionalInfo } = args.data;

        const slang = await Models.SlangModel.create({
          title: title,
          description: description,
          usage: usage,
          additionalInfo: additionalInfo,
        });

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    updateSlang: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const { id } = args.data;

        if (user.role !== 'admin') {
          throw new GraphQLError('Access Denied');
        }

        const slang = await Models.SlangModel.findOne({ _id: id });

        if (!slang) {
          throw new GraphQLError('Slang not found');
        }

        const updates = Object.keys(args);

        for (let update of updates) {
          slang[update] = args[update];
        }

        await slang.save();

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Query: {
    deleteSlang: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const { id } = args;

        if (user.role !== 'admin') {
          throw new GraphQLError('Access Denied');
        }

        const slang = await Models.SlangModel.findOne({ _id: id });

        if (!slang) {
          throw new GraphQLError('Slang not found');
        }

        await slang.remove();

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    likeSlang: async (parent, args, context, info) => {
      try {
        const { id } = args;

        const slang = await Models.SlangModel.findOne({ _id: id });

        if (!slang) {
          throw new GraphQLError('Slang not found');
        }

        slang.likes += 1;

        await slang.save();

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
  },
};
