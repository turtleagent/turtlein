import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";

const requireAuthenticatedUserId = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  return userId;
};

export const followUser = mutation({
  args: {
    followedId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const followerId = await requireAuthenticatedUserId(ctx);
    if (followerId === args.followedId) {
      throw new Error("Cannot follow yourself");
    }

    const [follower, followed, existingFollow] = await Promise.all([
      ctx.db.get(followerId),
      ctx.db.get(args.followedId),
      ctx.db
        .query("follows")
        .withIndex("byFollowerAndFollowed", (q) =>
          q.eq("followerId", followerId).eq("followedId", args.followedId),
        )
        .first(),
    ]);

    if (!follower || !followed) {
      throw new Error("User not found");
    }

    if (existingFollow) {
      return existingFollow._id;
    }

    const followId = await ctx.db.insert("follows", {
      followerId,
      followedId: args.followedId,
      createdAt: Date.now(),
    });

    await ctx.runMutation(internal.notifications.createNotification, {
      userId: args.followedId,
      type: "follow",
      fromUserId: followerId,
    });

    return followId;
  },
});

export const unfollowUser = mutation({
  args: {
    followedId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const followerId = await requireAuthenticatedUserId(ctx);
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("byFollowerAndFollowed", (q) =>
        q.eq("followerId", followerId).eq("followedId", args.followedId),
      )
      .first();

    if (!existingFollow) {
      return { unfollowed: false };
    }

    await ctx.db.delete(existingFollow._id);
    return { unfollowed: true };
  },
});

export const getFollowerCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .withIndex("byFollowed", (q) => q.eq("followedId", args.userId))
      .collect();

    return followers.length;
  },
});

export const getFollowingCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query("follows")
      .withIndex("byFollower", (q) => q.eq("followerId", args.userId))
      .collect();

    return following.length;
  },
});

export const isFollowing = query({
  args: {
    followedId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const followerId = await getAuthUserId(ctx);
    if (!followerId || followerId === args.followedId) {
      return false;
    }

    const follow = await ctx.db
      .query("follows")
      .withIndex("byFollowerAndFollowed", (q) =>
        q.eq("followerId", followerId).eq("followedId", args.followedId),
      )
      .first();

    return Boolean(follow);
  },
});
