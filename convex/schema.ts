import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  history: defineTable({
    topic: v.string(),
    mode: v.union(v.literal("quiz"), v.literal("flashcard")),
    data: v.any(), // Array of questions or flashcards
    createdAt: v.number(),
  }),
  attempts: defineTable({
    userId: v.string(),
    userEmail: v.string(),
    userName: v.optional(v.string()),
    topic: v.string(),
    score: v.number(),
    total: v.number(),
    timeTaken: v.number(),
    timestamp: v.number(),
  }).index("by_user", ["userId"]),
});
