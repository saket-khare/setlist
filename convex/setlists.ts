import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("setlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("setlists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const setlist = await ctx.db.get(args.id);
    if (!setlist || setlist.userId !== userId) {
      throw new Error("Setlist not found or unauthorized");
    }

    const songs = await Promise.all(
      setlist.songIds.map((songId) => ctx.db.get(songId))
    );

    return {
      ...setlist,
      songs: songs.filter((song): song is NonNullable<typeof song> => song !== null),
    };
  },
});

export const getByShareToken = query({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    const setlist = await ctx.db
      .query("setlists")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.shareToken))
      .first();

    if (!setlist || !setlist.isPublic) {
      throw new Error("Setlist not found or not public");
    }

    const songs = await Promise.all(
      setlist.songIds.map((songId) => ctx.db.get(songId))
    );

    return {
      ...setlist,
      songs: songs.filter((song): song is NonNullable<typeof song> => song !== null),
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    songIds: v.array(v.id("songs")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("setlists", {
      ...args,
      userId,
      isPublic: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("setlists"),
    name: v.string(),
    description: v.optional(v.string()),
    songIds: v.array(v.id("songs")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const setlist = await ctx.db.get(args.id);
    if (!setlist || setlist.userId !== userId) {
      throw new Error("Setlist not found or unauthorized");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("setlists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const setlist = await ctx.db.get(args.id);
    if (!setlist || setlist.userId !== userId) {
      throw new Error("Setlist not found or unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const generateShareToken = mutation({
  args: { id: v.id("setlists") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const setlist = await ctx.db.get(args.id);
    if (!setlist || setlist.userId !== userId) {
      throw new Error("Setlist not found or unauthorized");
    }

    const shareToken = Math.random().toString(36).substring(2, 15);
    
    await ctx.db.patch(args.id, {
      isPublic: true,
      shareToken,
    });

    return shareToken;
  },
});
