import { GraphQLError } from 'graphql';
import Models from '../../models';

export const resolvers = {
  Mutation: {
    createSlang: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const { title, description, usage, additionalInfo } = args.data;

        const slang = await Models.SlangModel.create({
          title: title,
          description: description,
          usage: usage,
          additionalInfo: additionalInfo,
          submittedById: user?.uid,
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
        const { _id } = args.data;

        if (user.role !== 'admin') {
          throw new GraphQLError('Access Denied');
        }

        const slang = await Models.SlangModel.findOne({ _id });

        if (!slang) {
          throw new GraphQLError('Slang not found');
        }

        delete args?.data?._id;

        const updates = Object.keys(args.data);

        for (let update of updates) {
          slang[update] = args.data[update];
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

        if (!slang?.likedByIds?.includes(user?.uid)) {
          slang.likedByIds = [...slang?.likedByIds, user?.uid];
        } else {
          await Models.SlangModel.updateOne({ _id: slang._id }, {
            $pull: {
              likedByIds: user.uid,
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
    bookmarkSlang: async (parent, args, context, info) => {
      try {
        const { user } = context;
        const { id } = args;

        const slang = await Models.SlangModel.findOne({ _id: id });

        if (!slang) {
          throw new GraphQLError('Slang not found');
        }

        if (!slang?.bookmarkedByIds?.includes(user?.uid)) {
          slang.bookmarkedByIds = [...slang?.bookmarkedByIds, user?.uid];
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

        const slangs: any = await Models.SlangModel.find({ submittedById: user?.uid }).lean();

        for (let slang of slangs) {
          slang.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
          slang.liked = slang?.likedByIds?.includes(user?.uid);
          slang.likes = slang?.likedByIds?.length ?? 0;
        }

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    getSavedSlangs: async (parent, args, context, info) => {
      try {
        const { user } = context;

        const slangs: any = await Models.SlangModel.find({ bookmarkedByIds: user?.uid }).lean();

        for (let slang of slangs) {
          slang.bookmarked = slang?.bookmarkedByIds?.includes(user?.uid);
          slang.liked = slang?.likedByIds?.includes(user?.uid);
          slang.likes = slang?.likedByIds?.length ?? 0;
        }

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    },
    getSubmissions: async (parent, args, context, info) => {
      try {
        const { user } = context;

        if (user?.role !== 'admin') {
          throw new GraphQLError('Access Denied');
        }

        const slangs = await Models.SlangModel.find({
          status: 'pending',
        }).sort({
          title: 1,
        });

        return slangs;
      } catch (error) {
        console.log(error);
        throw new GraphQLError(error?.message);
      }
    }
  },
};
