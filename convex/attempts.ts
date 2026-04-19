import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveAttempt = mutation({
  args: {
    userId: v.string(),
    userEmail: v.string(),
    userName: v.optional(v.string()),
    topic: v.string(),
    score: v.number(),
    total: v.number(),
    timeTaken: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("attempts", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getLeaderboard = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("attempts")
      .order("desc")
      .take(10);
  },
});

export const getUserAttempts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attempts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
