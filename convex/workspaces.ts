import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { auth } from './auth';

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('UnAuthorized');
    }
    const joinCode = '123456';
    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      joinCode,
      userId,
    });
    // const workspace = ctx.db.get(workspaceId);
    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('workspaces').collect();
  },
});

export const getById = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error('unauthorized');
    }
    return await ctx.db.get(args.id);
  },
});
