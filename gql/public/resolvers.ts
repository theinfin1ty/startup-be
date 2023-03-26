import { GraphQLError } from 'graphql';
import Models from '../../models';

export const resolvers = {
  Query: {
    getEverything: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const slangs: any = await Models.SlangModel.find({
          status: 'approved',
        }).sort({
          title: 1,
        })
        .lean();

        if (user) {
          for (let slang of slangs) {
            slang.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
            slang.liked = slang?.likedByIds?.includes(user?.uid);
            slang.likes = slang?.likedByIds?.length ?? 0;
          }
        }

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },

    getSlang: async (parent, args, context, info) => {
      try {
        const { id } = args;
        const { user } = context;
        const slang: any = await Models.SlangModel.findOne({ _id: id }).lean();

        if (user) {
          slang.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
          slang.liked = slang?.likedByIds?.includes(user?.uid);
          slang.likes = slang?.likedByIds?.length ?? 0;
        }

        return slang;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },

    getTrending: async (parent, args, context, info) => {
      try {
        const { id, page, size } = args;
        const { user } = context;

        const slangs: any = await Models.SlangModel
          .find({
            status: 'approved'
          })
          .sort({ likes: -1 })
          .lean();

        if (user) {
          for (let slang of slangs) {
            slang.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
            slang.liked = slang?.likedByIds?.includes(user?.uid);
            slang.likes = slang?.likedByIds?.length ?? 0;
          }
        }

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
  },
};
