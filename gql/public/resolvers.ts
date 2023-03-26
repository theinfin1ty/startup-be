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
        });

        if (user) {
          for (let slang of slangs) {
            slang._doc.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
            slang._doc.liked = slang?.likedByIds?.includes(user?.uid);
            slang._doc.likes = slang?.likedByIds?.length;
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
        const slang: any = await Models.SlangModel.findOne({ _id: id });

        if (user) {
          slang._doc.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
          slang._doc.liked = slang?.likedByIds?.includes(user?.uid);
          slang._doc.likes = slang?.likedByIds?.length;
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
          .sort({ likes: -1 });

        if (user) {
          for (let slang of slangs) {
            slang._doc.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
            slang._doc.liked = slang?.likedByIds?.includes(user?.uid);
            slang._doc.likes = slang?.likedByIds?.length;
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
