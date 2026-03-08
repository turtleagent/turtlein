import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";

export const getConnectedUserIds = async (
  ctx: QueryCtx,
  viewerId: Id<"users">,
) => {
  const [requestedConnections, receivedConnections] = await Promise.all([
    ctx.db
      .query("connections")
      .withIndex("byUser1", (q) => q.eq("userId1", viewerId).eq("status", "accepted"))
      .collect(),
    ctx.db
      .query("connections")
      .withIndex("byUser2", (q) => q.eq("userId2", viewerId).eq("status", "accepted"))
      .collect(),
  ]);

  const connectedUserIds = new Set<Id<"users">>();

  for (const connection of requestedConnections) {
    connectedUserIds.add(connection.userId2);
  }

  for (const connection of receivedConnections) {
    connectedUserIds.add(connection.userId1);
  }

  return connectedUserIds;
};

export const isPostVisibleToViewer = (
  post: Doc<"posts">,
  viewerId: Id<"users"> | null,
  connectedUserIds?: ReadonlySet<Id<"users">>,
) => {
  if (post.visibility !== "connections") {
    return true;
  }

  if (!viewerId) {
    return false;
  }

  if (post.authorId === viewerId) {
    return true;
  }

  return connectedUserIds?.has(post.authorId) ?? false;
};

export const canViewerAccessPost = async (
  ctx: QueryCtx,
  post: Doc<"posts">,
  viewerId: Id<"users"> | null,
) => {
  if (post.visibility !== "connections") {
    return true;
  }

  if (!viewerId) {
    return false;
  }

  const connectedUserIds = await getConnectedUserIds(ctx, viewerId);
  return isPostVisibleToViewer(post, viewerId, connectedUserIds);
};

export const filterVisiblePosts = async (
  ctx: QueryCtx,
  posts: Doc<"posts">[],
  viewerId: Id<"users"> | null,
) => {
  if (!posts.some((post) => post.visibility === "connections")) {
    return posts;
  }

  const connectedUserIds = viewerId
    ? await getConnectedUserIds(ctx, viewerId)
    : undefined;

  return posts.filter((post) =>
    isPostVisibleToViewer(post, viewerId, connectedUserIds),
  );
};
