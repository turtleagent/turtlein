import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { buildAuthorSummary } from "./helpers";

const updateUserConnectionCount = async (
  ctx: MutationCtx,
  userId: Id<"users">,
  delta: number,
) => {
  const user = await ctx.db.get(userId);
  if (!user) {
    return;
  }

  const currentCount = typeof user.connections === "number" ? user.connections : 0;
  await ctx.db.patch(userId, {
    connections: Math.max(0, currentCount + delta),
  });
};

const requireAuthenticatedUserId = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  return userId;
};

const requireConnectionParticipant = async (
  ctx: MutationCtx,
  connectionId: Id<"connections">,
  userId: Id<"users">,
) => {
  const connection = await ctx.db.get(connectionId);
  if (!connection) {
    throw new Error("Connection not found");
  }

  if (connection.userId1 !== userId && connection.userId2 !== userId) {
    throw new Error("Not authorized to access this connection");
  }

  return connection;
};

export const sendConnectionRequest = mutation({
  args: {
    toUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const fromUserId = await requireAuthenticatedUserId(ctx);
    if (fromUserId === args.toUserId) {
      throw new Error("Cannot connect with yourself");
    }

    const [fromUser, toUser, existingForward, existingReverse] = await Promise.all([
      ctx.db.get(fromUserId),
      ctx.db.get(args.toUserId),
      ctx.db
        .query("connections")
        .withIndex("byUsers", (q) =>
          q.eq("userId1", fromUserId).eq("userId2", args.toUserId),
        )
        .first(),
      ctx.db
        .query("connections")
        .withIndex("byUsers", (q) =>
          q.eq("userId1", args.toUserId).eq("userId2", fromUserId),
        )
        .first(),
    ]);

    if (!fromUser || !toUser) {
      throw new Error("User not found");
    }

    if (existingForward || existingReverse) {
      throw new Error("Connection already exists");
    }

    const connectionId = await ctx.db.insert("connections", {
      userId1: fromUserId,
      userId2: args.toUserId,
      status: "pending",
      requestedBy: fromUserId,
      createdAt: Date.now(),
    });

    await ctx.db.insert("notifications", {
      userId: args.toUserId,
      type: "connection_request",
      fromUserId,
      read: false,
      createdAt: Date.now(),
    });

    return connectionId;
  },
});

export const acceptConnection = mutation({
  args: {
    connectionId: v.id("connections"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const connection = await requireConnectionParticipant(ctx, args.connectionId, userId);
    const recipientId =
      connection.requestedBy === connection.userId1
        ? connection.userId2
        : connection.userId1;

    if (recipientId !== userId) {
      throw new Error("Not authorized to accept this connection request");
    }

    if (connection.status !== "accepted") {
      await ctx.db.patch(args.connectionId, {
        status: "accepted",
      });

      await Promise.all([
        updateUserConnectionCount(ctx, connection.userId1, 1),
        updateUserConnectionCount(ctx, connection.userId2, 1),
      ]);

      const acceptedBy =
        connection.requestedBy === connection.userId1
          ? connection.userId2
          : connection.userId1;

      await ctx.db.insert("notifications", {
        userId: connection.requestedBy,
        type: "connection_accepted",
        fromUserId: acceptedBy,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

export const rejectConnection = mutation({
  args: {
    connectionId: v.id("connections"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const connection = await requireConnectionParticipant(ctx, args.connectionId, userId);
    const recipientId =
      connection.requestedBy === connection.userId1
        ? connection.userId2
        : connection.userId1;

    if (connection.status !== "pending") {
      throw new Error("Only pending requests can be rejected");
    }

    if (recipientId !== userId) {
      throw new Error("Not authorized to reject this connection request");
    }

    await ctx.db.delete(args.connectionId);
  },
});

export const removeConnection = mutation({
  args: {
    connectionId: v.id("connections"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const connection = await requireConnectionParticipant(ctx, args.connectionId, userId);

    await ctx.db.delete(args.connectionId);

    if (connection.status === "accepted") {
      await Promise.all([
        updateUserConnectionCount(ctx, connection.userId1, -1),
        updateUserConnectionCount(ctx, connection.userId2, -1),
      ]);
    }
  },
});

export const getConnectionStatus = query({
  args: {
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    if (userId === args.targetUserId) {
      return { status: "none" as const };
    }

    const [forwardConnection, reverseConnection] = await Promise.all([
      ctx.db
        .query("connections")
        .withIndex("byUsers", (q) =>
          q.eq("userId1", userId).eq("userId2", args.targetUserId),
        )
        .first(),
      ctx.db
        .query("connections")
        .withIndex("byUsers", (q) =>
          q.eq("userId1", args.targetUserId).eq("userId2", userId),
        )
        .first(),
    ]);

    const connection = forwardConnection ?? reverseConnection;

    if (!connection) {
      return { status: "none" as const };
    }

    if (connection.status === "accepted") {
      return {
        status: "accepted" as const,
        connectionId: connection._id,
      };
    }

    return {
      status: "pending" as const,
      connectionId: connection._id,
      direction:
        connection.requestedBy === userId
          ? ("sent" as const)
          : ("received" as const),
    };
  },
});

export const listConnections = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const [requestedConnections, receivedConnections] = await Promise.all([
      ctx.db
        .query("connections")
        .withIndex("byUser1", (q) =>
          q.eq("userId1", args.userId).eq("status", "accepted"),
        )
        .collect(),
      ctx.db
        .query("connections")
        .withIndex("byUser2", (q) =>
          q.eq("userId2", args.userId).eq("status", "accepted"),
        )
        .collect(),
    ]);

    const allConnections = [
      ...requestedConnections.map((connection) => ({
        connectionId: connection._id,
        otherUserId: connection.userId2,
      })),
      ...receivedConnections.map((connection) => ({
        connectionId: connection._id,
        otherUserId: connection.userId1,
      })),
    ];

    const withUsers = await Promise.all(
      allConnections.map(async (connection) => {
        const user = await ctx.db.get(connection.otherUserId);
        if (!user) {
          return null;
        }

        const userSummary = await buildAuthorSummary(ctx, user);
        return {
          connectionId: connection.connectionId,
          user: userSummary
            ? {
                ...userSummary,
                location: user.location ?? "",
              }
            : null,
        };
      }),
    );

    return withUsers
      .filter(
        (
          connection,
        ): connection is NonNullable<typeof connection> & {
          user: NonNullable<NonNullable<typeof connection>["user"]>;
        } => connection !== null && connection.user !== null,
      )
      .sort((a, b) => a.user.displayName.localeCompare(b.user.displayName));
  },
});

export const listPendingRequests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const pendingConnections = await ctx.db
      .query("connections")
      .withIndex("byUser2", (q) =>
        q.eq("userId2", userId).eq("status", "pending"),
      )
      .collect();

    const withUsers = await Promise.all(
      pendingConnections.map(async (connection) => {
        const requester = await ctx.db.get(connection.requestedBy);
        if (!requester) {
          return null;
        }

        const requesterSummary = await buildAuthorSummary(ctx, requester);
        return {
          connectionId: connection._id,
          user: requesterSummary
            ? {
                ...requesterSummary,
                location: requester.location ?? "",
              }
            : null,
        };
      }),
    );

    return withUsers
      .filter(
        (
          connection,
        ): connection is NonNullable<typeof connection> & {
          user: NonNullable<NonNullable<typeof connection>["user"]>;
        } => connection !== null && connection.user !== null,
      )
      .sort((a, b) => a.user.displayName.localeCompare(b.user.displayName));
  },
});

export const getConnectionCount = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return 0;
    }

    if (typeof user.connections === "number") {
      return user.connections;
    }

    const [requestedConnections, receivedConnections] = await Promise.all([
      ctx.db
        .query("connections")
        .withIndex("byUser1", (q) =>
          q.eq("userId1", args.userId).eq("status", "accepted"),
        )
        .collect(),
      ctx.db
        .query("connections")
        .withIndex("byUser2", (q) =>
          q.eq("userId2", args.userId).eq("status", "accepted"),
        )
        .collect(),
    ]);

    return requestedConnections.length + receivedConnections.length;
  },
});

export const getMutualConnectionsCount = query({
  args: {
    targetUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const viewerUserId = await requireAuthenticatedUserId(ctx);
    if (viewerUserId === args.targetUserId) {
      return 0;
    }

    const [viewerUser, targetUser] = await Promise.all([
      ctx.db.get(viewerUserId),
      ctx.db.get(args.targetUserId),
    ]);
    if (!viewerUser || !targetUser) {
      return 0;
    }
    if (viewerUser.connections === 0 || targetUser.connections === 0) {
      return 0;
    }

    const [
      viewerRequestedConnections,
      viewerReceivedConnections,
      targetRequestedConnections,
      targetReceivedConnections,
    ] = await Promise.all([
      ctx.db
        .query("connections")
        .withIndex("byUser1", (q) =>
          q.eq("userId1", viewerUserId).eq("status", "accepted"),
        )
        .collect(),
      ctx.db
        .query("connections")
        .withIndex("byUser2", (q) =>
          q.eq("userId2", viewerUserId).eq("status", "accepted"),
        )
        .collect(),
      ctx.db
        .query("connections")
        .withIndex("byUser1", (q) =>
          q.eq("userId1", args.targetUserId).eq("status", "accepted"),
        )
        .collect(),
      ctx.db
        .query("connections")
        .withIndex("byUser2", (q) =>
          q.eq("userId2", args.targetUserId).eq("status", "accepted"),
        )
        .collect(),
    ]);

    const viewerConnectionUserIds = new Set([
      ...viewerRequestedConnections.map((connection) => connection.userId2),
      ...viewerReceivedConnections.map((connection) => connection.userId1),
    ]);

    if (viewerConnectionUserIds.size === 0) {
      return 0;
    }

    const targetConnectionUserIds = new Set([
      ...targetRequestedConnections.map((connection) => connection.userId2),
      ...targetReceivedConnections.map((connection) => connection.userId1),
    ]);

    if (targetConnectionUserIds.size === 0) {
      return 0;
    }

    const smallerSet =
      viewerConnectionUserIds.size <= targetConnectionUserIds.size
        ? viewerConnectionUserIds
        : targetConnectionUserIds;
    const largerSet =
      smallerSet === viewerConnectionUserIds
        ? targetConnectionUserIds
        : viewerConnectionUserIds;

    let mutualCount = 0;
    for (const connectionUserId of smallerSet) {
      if (largerSet.has(connectionUserId)) {
        mutualCount += 1;
      }
    }

    return mutualCount;
  },
});
