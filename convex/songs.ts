import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    search: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    singer: v.optional(v.string()),
    movie: v.optional(v.string()),
    scale: v.optional(v.string()),
    era: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let songs = await ctx.db
      .query("songs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Apply filters
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      songs = songs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchLower) ||
          song.singer?.toLowerCase().includes(searchLower) ||
          song.movie?.toLowerCase().includes(searchLower)
      );
    }

    if (args.tags && args.tags.length > 0) {
      songs = songs.filter((song) =>
        args.tags!.some((tag) => song.tags.includes(tag))
      );
    }

    if (args.singer) {
      songs = songs.filter((song) => song.singer === args.singer);
    }

    if (args.movie) {
      songs = songs.filter((song) => song.movie === args.movie);
    }

    if (args.scale) {
      songs = songs.filter((song) => song.scale === args.scale);
    }

    if (args.era) {
      songs = songs.filter((song) => song.era === args.era);
    }

    return songs.sort((a, b) => a.title.localeCompare(b.title));
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    singer: v.optional(v.string()),
    movie: v.optional(v.string()),
    scale: v.optional(v.string()),
    era: v.optional(v.string()),
    actor: v.optional(v.string()),
    hasShayari: v.optional(v.boolean()),
    tags: v.array(v.string()),
    lyrics: v.optional(v.string()),
    chords: v.optional(v.string()),
    notes: v.optional(v.string()),
    lyricsWithChords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("songs", {
      ...args,
      userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("songs"),
    title: v.string(),
    singer: v.optional(v.string()),
    movie: v.optional(v.string()),
    scale: v.optional(v.string()),
    era: v.optional(v.string()),
    actor: v.optional(v.string()),
    hasShayari: v.optional(v.boolean()),
    tags: v.array(v.string()),
    lyrics: v.optional(v.string()),
    chords: v.optional(v.string()),
    notes: v.optional(v.string()),
    lyricsWithChords: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const song = await ctx.db.get(args.id);
    if (!song || song.userId !== userId) {
      throw new Error("Song not found or unauthorized");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("songs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const song = await ctx.db.get(args.id);
    if (!song || song.userId !== userId) {
      throw new Error("Song not found or unauthorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const getFilterOptions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const songs = await ctx.db
      .query("songs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const singers = [...new Set(songs.map((s) => s.singer).filter(Boolean))];
    const movies = [...new Set(songs.map((s) => s.movie).filter(Boolean))];
    const scales = [...new Set(songs.map((s) => s.scale).filter(Boolean))];
    const eras = [...new Set(songs.map((s) => s.era).filter(Boolean))];
    const allTags = [...new Set(songs.flatMap((s) => s.tags))];

    return {
      singers: singers.sort(),
      movies: movies.sort(),
      scales: scales.sort(),
      eras: eras.sort(),
      tags: allTags.sort(),
    };
  },
});

export const get = query({
  args: { id: v.id("songs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const song = await ctx.db.get(args.id);
    if (!song || song.userId !== userId) {
      throw new Error("Song not found or unauthorized");
    }

    return song;
  },
});
