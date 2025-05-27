import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getPredefined = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("predefinedTags").collect();
  },
});

export const initializePredefinedTags = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("predefinedTags").first();
    if (existing) return;

    const predefinedTags = [
      // Mood
      { category: "mood", name: "upbeat", color: "#10b981" },
      { category: "mood", name: "mellow", color: "#6366f1" },
      { category: "mood", name: "sad", color: "#64748b" },
      
      // Emotion
      { category: "emotion", name: "love", color: "#ef4444" },
      { category: "emotion", name: "friendship", color: "#f59e0b" },
      { category: "emotion", name: "mother", color: "#ec4899" },
      { category: "emotion", name: "father", color: "#8b5cf6" },
      { category: "emotion", name: "brother", color: "#06b6d4" },
      { category: "emotion", name: "sister", color: "#84cc16" },
      
      // Occasion
      { category: "occasion", name: "deshbhakti", color: "#f97316" },
      { category: "occasion", name: "bhajan", color: "#eab308" },
      
      // Pace
      { category: "pace", name: "fast", color: "#dc2626" },
      { category: "pace", name: "slow", color: "#059669" },
      
      // Other
      { category: "other", name: "dance", color: "#7c3aed" },
      { category: "other", name: "shayari", color: "#be185d" },
    ];

    for (const tag of predefinedTags) {
      await ctx.db.insert("predefinedTags", tag);
    }
  },
});
