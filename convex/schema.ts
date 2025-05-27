import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  songs: defineTable({
    title: v.string(),
    singer: v.optional(v.string()),
    movie: v.optional(v.string()),
    scale: v.optional(v.string()),
    era: v.optional(v.string()),
    actor: v.optional(v.string()),
    hasShayari: v.optional(v.boolean()),
    tags: v.array(v.string()),
    userId: v.id("users"),
    lyrics: v.optional(v.string()),
    chords: v.optional(v.string()),
    notes: v.optional(v.string()),
    lyricsWithChords: v.optional(v.string()),
  })
    .searchIndex("search", {
      searchField: "title",
      filterFields: ["singer", "movie", "scale", "era", "tags"],
    })
    .index("by_user", ["userId"])
    .index("by_title", ["title"])
    .index("by_singer", ["singer"])
    .index("by_movie", ["movie"])
    .index("by_scale", ["scale"])
    .index("by_era", ["era"]),

  setlists: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    songIds: v.array(v.id("songs")),
    userId: v.id("users"),
    isPublic: v.optional(v.boolean()),
    shareToken: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_share_token", ["shareToken"]),

  predefinedTags: defineTable({
    category: v.string(),
    name: v.string(),
    color: v.optional(v.string()),
  }).index("by_category", ["category"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
