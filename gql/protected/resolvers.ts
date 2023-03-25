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
        const { user } = context;
        const { id } = args;

        const slang = await Models.SlangModel.findOne({ _id: id });

        if (!slang) {
          throw new GraphQLError('Slang not found');
        }

        if(!slang?.likedByIds?.includes(user?.uid)) {
          slang.likedByIds = [ ...slang?.likedByIds, user?.uid ];
          slang.likes += 1;
        } else {
          await Models.SlangModel.updateOne({ _id: slang._id }, {
            $pull: {
              likedByIds: user.uid,
            },
            likes: slang.likes - 1,
          })
        }

        await slang.save();

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    bookmarkSlang: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const { id } = args;

        const slang = await Models.SlangModel.findOne({ _id: id });

        if (!slang) {
          throw new GraphQLError('Slang not found');
        }

        if(!slang?.bookmarkedByIds?.includes(user?.uid)) {
          slang.bookmarkedByIds = [ ...slang?.bookmarkedByIds, user?.uid ];
        } else {
          await Models.SlangModel.updateOne({ _id: slang._id }, {
            $pull: {
              bookmarkedByIds: user.uid,
            }
          })
        }

        await slang.save();

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    getUserSlangs: async (parent, args, context, info) => {
      try {
        const { user } = context;
        
        const slangs = await Models.SlangModel.find({ submittedById: user?.uid });

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    getSavedSlangs: async (parent, args, context, info) => {
      try {
        const { user } = context;

        const slangs = await Models.SlangModel.find({ bookmarkedByIds: user?.uid });

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    }
  },
};
