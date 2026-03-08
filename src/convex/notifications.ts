import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { buildAuthorSummary } from "./helpers";

const requireAuthenticatedUserId = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  return userId;
};

export const createNotification = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    fromUserId: v.id("users"),
    postId: v.optional(v.id("posts")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    if (args.userId === args.fromUserId) {
      return null;
    }

    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      fromUserId: args.fromUserId,
      ...(args.postId ? { postId: args.postId } : {}),
      ...(args.conversationId ? { conversationId: args.conversationId } : {}),
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const listNotifications = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const sortedNotifications = [...notifications]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);

    return await Promise.all(
      sortedNotifications.map(async (notification) => {
        const [fromUser, company] = await Promise.all([
          ctx.db.get(notification.fromUserId),
          notification.companyId ? ctx.db.get(notification.companyId) : Promise.resolve(null),
        ]);

        return {
          ...notification,
          fromUser: await buildAuthorSummary(ctx, fromUser),
          ...(company
            ? {
                company: {
                  _id: company._id,
                  name: company.name,
                  slug: company.slug,
                },
              }
            : {}),
        };
      }),
    );
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("read"), false),
        ),
      )
      .collect();

    return unreadNotifications.length;
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      return;
    }

    if (notification.userId !== userId) {
      throw new Error("Not authorized to update this notification");
    }

    if (notification.read) {
      return;
    }

    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("read"), false),
        ),
      )
      .collect();

    await Promise.all(
      unreadNotifications.map((notification) =>
        ctx.db.patch(notification._id, { read: true }),
      ),
    );
  },
});
