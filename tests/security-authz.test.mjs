import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (
        (specifier.startsWith("./") || specifier.startsWith("../")) &&
        !specifier.endsWith(".js") &&
        !specifier.endsWith(".ts")
      ) {
        for (const extension of [".ts", ".js"]) {
          try {
            return nextResolve(`${specifier}${extension}`, context);
          } catch {}
        }
      }

      throw error;
    }
  },
});

const notificationsModulePromise = import("../src/convex/notifications.ts");
const messagingModulePromise = import("../src/convex/messaging.ts");
const followsModulePromise = import("../src/convex/follows.ts");
const connectionsModulePromise = import("../src/convex/connections.ts");
const commentsModulePromise = import("../src/convex/comments.ts");
const hashtagsModulePromise = import("../src/convex/hashtags.ts");
const postsModulePromise = import("../src/convex/posts.ts");
const usersModulePromise = import("../src/convex/users.ts");

function createAuth(userId = null) {
  return {
    getUserIdentity: async () =>
      userId ? { subject: `${userId}|security-test-session` } : null,
  };
}

function isFieldReference(value) {
  return typeof value === "object" && value !== null && value.kind === "field";
}

function resolveFilterValue(value, doc) {
  return isFieldReference(value) ? doc[value.name] : value;
}

function createQuery(docs) {
  return {
    filter(buildPredicate) {
      const q = {
        field: (name) => ({ kind: "field", name }),
        eq: (left, right) => (doc) =>
          resolveFilterValue(left, doc) === resolveFilterValue(right, doc),
        and: (...predicates) => (doc) =>
          predicates.every((predicate) => predicate(doc)),
      };

      return createQuery(docs.filter(buildPredicate(q)));
    },
    withIndex(_indexName, buildRange) {
      const range = {
        conditions: [],
        eq(fieldName, value) {
          this.conditions.push({ fieldName, value });
          return this;
        },
      };

      buildRange(range);

      return createQuery(
        docs.filter((doc) =>
          range.conditions.every(
            ({ fieldName, value }) => doc[fieldName] === value,
          ),
        ),
      );
    },
    order(direction = "asc") {
      const sortedDocs = [...docs].sort((left, right) => {
        const leftValue = left._creationTime ?? left.createdAt ?? 0;
        const rightValue = right._creationTime ?? right.createdAt ?? 0;
        return leftValue - rightValue;
      });

      if (direction === "desc") {
        sortedDocs.reverse();
      }

      return createQuery(sortedDocs);
    },
    take: async (count) => docs.slice(0, count).map((doc) => ({ ...doc })),
    collect: async () => docs.map((doc) => ({ ...doc })),
    first: async () => (docs[0] ? { ...docs[0] } : null),
    unique: async () => {
      if (docs.length === 0) {
        return null;
      }

      if (docs.length === 1) {
        return { ...docs[0] };
      }

      throw new Error("Expected unique result");
    },
  };
}

function createDb(seed = {}) {
  const defaultTables = [
    "comments",
    "connections",
    "conversations",
    "follows",
    "messages",
    "notifications",
    "posts",
    "users",
  ];
  const tables = Object.fromEntries(
    [...new Set([...defaultTables, ...Object.keys(seed)])].map((table) => [
      table,
      (seed[table] ?? []).map((doc) => ({ ...doc })),
    ]),
  );

  const patchCalls = [];
  const insertCalls = [];
  const deleteCalls = [];
  const nextIds = Object.create(null);

  const findDocumentLocation = (id) => {
    for (const [table, docs] of Object.entries(tables)) {
      const index = docs.findIndex((candidate) => candidate._id === id);
      if (index !== -1) {
        return {
          table,
          docs,
          index,
          document: docs[index],
        };
      }
    }

    return null;
  };

  return {
    deleteCalls,
    insertCalls,
    patchCalls,
    tables,
    get: async (id) => findDocumentLocation(id)?.document ?? null,
    insert: async (table, value) => {
      tables[table] ??= [];
      nextIds[table] = (nextIds[table] ?? 0) + 1;
      const document = {
        _id: value._id ?? `${table}-${nextIds[table]}`,
        ...value,
      };
      tables[table].push(document);
      insertCalls.push({ table, document: { ...document } });
      return document._id;
    },
    patch: async (id, patchValue) => {
      const location = findDocumentLocation(id);
      if (!location) {
        throw new Error(`Document not found: ${id}`);
      }

      Object.assign(location.document, patchValue);
      patchCalls.push({ id, patch: { ...patchValue } });
    },
    delete: async (id) => {
      const location = findDocumentLocation(id);
      if (!location) {
        throw new Error(`Document not found: ${id}`);
      }

      location.docs.splice(location.index, 1);
      deleteCalls.push(id);
    },
    query: (table) => createQuery(tables[table] ?? []),
  };
}

function createStorage(urls = {}) {
  return {
    getUrl: async (storageId) => urls[storageId] ?? null,
  };
}

function createConnectionsVisibilitySeed() {
  return {
    comments: [
      {
        _id: "comment-public-1",
        authorId: "user-b",
        body: "Visible to everyone",
        createdAt: 31,
        postId: "post-public-user",
      },
      {
        _id: "comment-private-1",
        authorId: "user-b",
        body: "Visible to connections only",
        createdAt: 32,
        postId: "post-private-user",
      },
    ],
    connections: [
      {
        _id: "connection-1",
        createdAt: 1,
        requestedBy: "user-a",
        status: "accepted",
        userId1: "user-a",
        userId2: "user-b",
      },
      {
        _id: "connection-2",
        createdAt: 2,
        requestedBy: "user-d",
        status: "accepted",
        userId1: "user-d",
        userId2: "user-b",
      },
    ],
    hashtags: [
      {
        _id: "hashtag-1",
        postId: "post-public-user",
        tag: "scope",
      },
      {
        _id: "hashtag-2",
        postId: "post-private-user",
        tag: "scope",
      },
    ],
    posts: [
      {
        _id: "post-public-user",
        authorId: "user-a",
        commentsCount: 1,
        createdAt: 10,
        description: "Public roadmap update #scope",
        likesCount: 1,
        visibility: "public",
      },
      {
        _id: "post-private-user",
        authorId: "user-a",
        commentsCount: 1,
        createdAt: 20,
        description: "Connections roadmap update #scope",
        likesCount: 2,
        visibility: "connections",
      },
      {
        _id: "post-public-company",
        authorId: "user-d",
        commentsCount: 0,
        companyId: "company-1",
        createdAt: 30,
        description: "Public company memo",
        likesCount: 3,
        visibility: "public",
      },
      {
        _id: "post-private-company",
        authorId: "user-d",
        commentsCount: 0,
        companyId: "company-1",
        createdAt: 40,
        description: "Connections company memo",
        likesCount: 4,
        visibility: "connections",
      },
    ],
    users: [
      {
        _id: "user-a",
        displayName: "Author A",
        photoURL: "https://images.example/a.png",
        title: "Engineer",
        username: "author-a",
      },
      {
        _id: "user-b",
        displayName: "Viewer B",
        photoURL: "https://images.example/b.png",
        title: "Designer",
        username: "viewer-b",
      },
      {
        _id: "user-c",
        displayName: "Viewer C",
        photoURL: "https://images.example/c.png",
        title: "Analyst",
        username: "viewer-c",
      },
      {
        _id: "user-d",
        displayName: "Company Author",
        photoURL: "https://images.example/d.png",
        title: "Marketing Lead",
        username: "company-author",
      },
    ],
  };
}

function mapIds(rows) {
  return rows.map((row) => row._id);
}

async function assertRejectsWithMessage(run, expectedPattern) {
  await assert.rejects(run, (error) => {
    const message = error instanceof Error ? error.message : String(error);
    assert.match(message, expectedPattern);
    return true;
  });
}

test("notifications deny guests and block cross-user state changes", async () => {
  const {
    getUnreadCount,
    listNotifications,
    markAllAsRead,
    markAsRead,
  } = await notificationsModulePromise;

  const db = createDb({
    notifications: [
      {
        _id: "notification-1",
        createdAt: 1,
        fromUserId: "user-b",
        read: false,
        type: "message",
        userId: "user-a",
      },
    ],
  });

  await assertRejectsWithMessage(
    () => listNotifications._handler({ auth: createAuth(), db }, {}),
    /Not authenticated/,
  );
  await assertRejectsWithMessage(
    () => getUnreadCount._handler({ auth: createAuth(), db }, {}),
    /Not authenticated/,
  );
  await assertRejectsWithMessage(
    () => markAllAsRead._handler({ auth: createAuth(), db }, {}),
    /Not authenticated/,
  );
  await assertRejectsWithMessage(
    () =>
      markAsRead._handler(
        {
          auth: createAuth("user-b"),
          db,
        },
        { notificationId: "notification-1" },
      ),
    /Not authorized to update this notification/,
  );

  await markAllAsRead._handler(
    {
      auth: createAuth("user-b"),
      db,
    },
    {},
  );

  assert.equal(db.tables.notifications[0].read, false);
  assert.deepEqual(db.patchCalls, []);
});

test("messaging denies guests, non-participants, and guest maintenance calls", async () => {
  const {
    backfillEncryptionKeys,
    listConversations,
    listMessages,
    sendMessage,
  } = await messagingModulePromise;

  const db = createDb({
    conversations: [
      {
        _id: "conversation-1",
        createdAt: 1,
        participants: ["user-a", "user-b"],
      },
    ],
  });

  await assertRejectsWithMessage(
    () => listConversations._handler({ auth: createAuth(), db }, {}),
    /Not authenticated/,
  );
  await assertRejectsWithMessage(
    () =>
      listMessages._handler(
        {
          auth: createAuth("user-c"),
          db,
        },
        { conversationId: "conversation-1" },
      ),
    /Not authorized to access this conversation/,
  );
  await assertRejectsWithMessage(
    () =>
      sendMessage._handler(
        {
          auth: createAuth("user-c"),
          db,
        },
        {
          body: "Unauthorized message",
          conversationId: "conversation-1",
        },
      ),
    /Not authorized to access this conversation/,
  );
  await assertRejectsWithMessage(
    () =>
      backfillEncryptionKeys._handler(
        {
          auth: createAuth(),
          runMutation: async () => undefined,
          runQuery: async () => [],
        },
        {},
      ),
    /Not authenticated/,
  );
});

test("follows bind writes to the session user instead of spoofed args", async () => {
  const { followUser, unfollowUser } = await followsModulePromise;

  const db = createDb({
    users: [{ _id: "user-a" }, { _id: "user-b" }, { _id: "user-c" }],
  });
  const runMutationCalls = [];

  await followUser._handler(
    {
      auth: createAuth("user-a"),
      db,
      runMutation: async (reference, args) => {
        runMutationCalls.push({ reference, args });
        return null;
      },
    },
    {
      followerId: "user-c",
      followedId: "user-b",
    },
  );

  assert.equal(db.tables.follows.length, 1);
  assert.equal(db.tables.follows[0].followerId, "user-a");
  assert.equal(db.tables.follows[0].followedId, "user-b");
  assert.equal(runMutationCalls.length, 1);
  assert.equal(runMutationCalls[0].args.fromUserId, "user-a");

  const result = await unfollowUser._handler(
    {
      auth: createAuth("user-a"),
      db,
    },
    {
      followerId: "user-c",
      followedId: "user-b",
    },
  );

  assert.deepEqual(result, { unfollowed: true });
  assert.equal(db.tables.follows.length, 0);
  assert.deepEqual(db.deleteCalls, ["follows-1"]);
});

test("connections reject spoofed actors and unauthorized state changes", async () => {
  const {
    acceptConnection,
    rejectConnection,
    removeConnection,
    sendConnectionRequest,
  } = await connectionsModulePromise;

  const requestDb = createDb({
    users: [{ _id: "user-a" }, { _id: "user-b" }, { _id: "user-c" }],
  });

  await sendConnectionRequest._handler(
    {
      auth: createAuth("user-a"),
      db: requestDb,
    },
    {
      fromUserId: "user-c",
      toUserId: "user-b",
    },
  );

  assert.equal(requestDb.tables.connections[0].userId1, "user-a");
  assert.equal(requestDb.tables.connections[0].requestedBy, "user-a");
  assert.equal(requestDb.tables.notifications[0].fromUserId, "user-a");

  const pendingDb = createDb({
    connections: [
      {
        _id: "connection-1",
        createdAt: 1,
        requestedBy: "user-a",
        status: "pending",
        userId1: "user-a",
        userId2: "user-b",
      },
    ],
    users: [
      { _id: "user-a", connections: 0 },
      { _id: "user-b", connections: 0 },
      { _id: "user-c", connections: 0 },
    ],
  });

  await assertRejectsWithMessage(
    () =>
      acceptConnection._handler(
        {
          auth: createAuth("user-a"),
          db: pendingDb,
        },
        { connectionId: "connection-1" },
      ),
    /Not authorized to accept this connection request/,
  );
  await assertRejectsWithMessage(
    () =>
      rejectConnection._handler(
        {
          auth: createAuth("user-a"),
          db: pendingDb,
        },
        { connectionId: "connection-1" },
      ),
    /Not authorized to reject this connection request/,
  );

  assert.equal(pendingDb.tables.connections[0].status, "pending");
  assert.deepEqual(pendingDb.patchCalls, []);
  assert.deepEqual(pendingDb.deleteCalls, []);

  const acceptedDb = createDb({
    connections: [
      {
        _id: "connection-2",
        createdAt: 1,
        requestedBy: "user-a",
        status: "accepted",
        userId1: "user-a",
        userId2: "user-b",
      },
    ],
    users: [
      { _id: "user-a", connections: 1 },
      { _id: "user-b", connections: 1 },
      { _id: "user-c", connections: 0 },
    ],
  });

  await assertRejectsWithMessage(
    () =>
      removeConnection._handler(
        {
          auth: createAuth("user-c"),
          db: acceptedDb,
        },
        { connectionId: "connection-2" },
      ),
    /Not authorized to access this connection/,
  );

  assert.equal(acceptedDb.tables.connections.length, 1);
  assert.deepEqual(acceptedDb.deleteCalls, []);
  assert.deepEqual(acceptedDb.patchCalls, []);
});

test("comments bind writes to the session user and reject spoofed deletes", async () => {
  const { addComment, deleteComment } = await commentsModulePromise;

  const db = createDb({
    comments: [
      {
        _id: "comment-1",
        authorId: "user-a",
        body: "First comment",
        createdAt: 1,
        postId: "post-1",
      },
    ],
    posts: [
      {
        _id: "post-1",
        authorId: "user-b",
        commentsCount: 1,
        visibility: "public",
      },
    ],
    users: [{ _id: "user-a" }, { _id: "user-b" }, { _id: "user-c" }],
  });
  const runMutationCalls = [];

  await addComment._handler(
    {
      auth: createAuth("user-a"),
      db,
      runMutation: async (reference, args) => {
        runMutationCalls.push({ reference, args });
        return null;
      },
    },
    {
      authorId: "user-c",
      body: "Second comment",
      postId: "post-1",
    },
  );

  assert.equal(db.tables.comments.length, 2);
  assert.equal(db.tables.comments[1].authorId, "user-a");
  assert.equal(db.tables.posts[0].commentsCount, 2);
  assert.equal(runMutationCalls.length, 1);
  assert.equal(runMutationCalls[0].args.fromUserId, "user-a");

  await assertRejectsWithMessage(
    () =>
      deleteComment._handler(
        {
          auth: createAuth("user-c"),
          db,
        },
        {
          commentId: "comment-1",
          userId: "user-a",
        },
      ),
    /Not authorized to delete this comment/,
  );

  assert.equal(db.tables.comments.length, 2);
  assert.deepEqual(db.deleteCalls, []);
});

test("comments hide connections-only threads from guests and strangers", async () => {
  const { listComments } = await commentsModulePromise;
  const storage = createStorage();

  const guestPublicComments = await listComments._handler(
    {
      auth: createAuth(),
      db: createDb(createConnectionsVisibilitySeed()),
      storage,
    },
    { postId: "post-public-user" },
  );
  const guestPrivateComments = await listComments._handler(
    {
      auth: createAuth(),
      db: createDb(createConnectionsVisibilitySeed()),
      storage,
    },
    { postId: "post-private-user" },
  );
  const strangerPrivateComments = await listComments._handler(
    {
      auth: createAuth("user-c"),
      db: createDb(createConnectionsVisibilitySeed()),
      storage,
    },
    { postId: "post-private-user" },
  );
  const connectedPrivateComments = await listComments._handler(
    {
      auth: createAuth("user-b"),
      db: createDb(createConnectionsVisibilitySeed()),
      storage,
    },
    { postId: "post-private-user" },
  );
  const authorPrivateComments = await listComments._handler(
    {
      auth: createAuth("user-a"),
      db: createDb(createConnectionsVisibilitySeed()),
      storage,
    },
    { postId: "post-private-user" },
  );

  assert.deepEqual(mapIds(guestPublicComments), ["comment-public-1"]);
  assert.deepEqual(guestPrivateComments, []);
  assert.deepEqual(strangerPrivateComments, []);
  assert.deepEqual(mapIds(connectedPrivateComments), ["comment-private-1"]);
  assert.deepEqual(mapIds(authorPrivateComments), ["comment-private-1"]);
  assert.equal(connectedPrivateComments[0].author?._id, "user-b");
});

test("post discovery queries filter connections-only posts for unauthorized viewers", async () => {
  const { getPostsByHashtag } = await hashtagsModulePromise;
  const { getCompanyPosts, listPostsByUser, searchPosts } = await postsModulePromise;
  const storage = createStorage();

  const guestCtx = {
    auth: createAuth(),
    db: createDb(createConnectionsVisibilitySeed()),
    storage,
  };
  const strangerCtx = {
    auth: createAuth("user-c"),
    db: createDb(createConnectionsVisibilitySeed()),
    storage,
  };
  const connectedCtx = {
    auth: createAuth("user-b"),
    db: createDb(createConnectionsVisibilitySeed()),
    storage,
  };

  const [
    guestUserPosts,
    guestCompanyPosts,
    guestSearchPosts,
    guestHashtagPosts,
    strangerUserPosts,
    strangerCompanyPosts,
    strangerSearchPosts,
    strangerHashtagPosts,
    connectedUserPosts,
    connectedCompanyPosts,
    connectedSearchPosts,
    connectedHashtagPosts,
  ] = await Promise.all([
    listPostsByUser._handler(guestCtx, { authorId: "user-a" }),
    getCompanyPosts._handler(guestCtx, { companyId: "company-1" }),
    searchPosts._handler(guestCtx, { query: "roadmap" }),
    getPostsByHashtag._handler(guestCtx, { tag: "#scope" }),
    listPostsByUser._handler(strangerCtx, { authorId: "user-a" }),
    getCompanyPosts._handler(strangerCtx, { companyId: "company-1" }),
    searchPosts._handler(strangerCtx, { query: "roadmap" }),
    getPostsByHashtag._handler(strangerCtx, { tag: "#scope" }),
    listPostsByUser._handler(connectedCtx, { authorId: "user-a" }),
    getCompanyPosts._handler(connectedCtx, { companyId: "company-1" }),
    searchPosts._handler(connectedCtx, { query: "roadmap" }),
    getPostsByHashtag._handler(connectedCtx, { tag: "#scope" }),
  ]);

  assert.deepEqual(mapIds(guestUserPosts), ["post-public-user"]);
  assert.deepEqual(mapIds(guestCompanyPosts), ["post-public-company"]);
  assert.deepEqual(mapIds(guestSearchPosts), ["post-public-user"]);
  assert.deepEqual(mapIds(guestHashtagPosts), ["post-public-user"]);

  assert.deepEqual(mapIds(strangerUserPosts), ["post-public-user"]);
  assert.deepEqual(mapIds(strangerCompanyPosts), ["post-public-company"]);
  assert.deepEqual(mapIds(strangerSearchPosts), ["post-public-user"]);
  assert.deepEqual(mapIds(strangerHashtagPosts), ["post-public-user"]);

  assert.deepEqual(mapIds(connectedUserPosts), ["post-private-user", "post-public-user"]);
  assert.deepEqual(mapIds(connectedCompanyPosts), [
    "post-private-company",
    "post-public-company",
  ]);
  assert.deepEqual(mapIds(connectedSearchPosts), ["post-private-user", "post-public-user"]);
  assert.deepEqual(mapIds(connectedHashtagPosts), ["post-private-user", "post-public-user"]);
});

test("user profile queries and mutations omit private auth fields", async () => {
  const {
    getCurrentUser,
    getUser,
    updateCurrentUserProfile,
  } = await usersModulePromise;

  const privateUser = {
    _id: "user-a",
    _creationTime: 1,
    name: "Private Auth Name",
    email: "private@example.com",
    image: "https://auth.example/avatar.png",
    emailVerificationTime: 123456789,
    isAnonymous: false,
    displayName: "Public Name",
    username: "public-name",
    title: "Software Engineer",
    headline: "Building secure products",
    location: "Prague",
    about: "About text",
    skills: ["TypeScript"],
    experienceEntries: [],
    educationEntries: [],
    featuredPostIds: ["post-1"],
    connections: 12,
    followers: 4,
    photoURL: "https://images.example/fallback-photo.png",
    photoStorageId: "storage-photo",
    coverStorageId: "storage-cover",
  };
  const db = createDb({
    users: [privateUser],
  });
  const storage = createStorage({
    "storage-photo": "https://cdn.example/photo.png",
    "storage-cover": "https://cdn.example/cover.png",
  });

  const publicProfile = await getUser._handler(
    {
      db,
      storage,
    },
    { id: "user-a" },
  );
  const currentUserProfile = await getCurrentUser._handler(
    {
      auth: createAuth("user-a"),
      db,
      storage,
    },
    {},
  );
  const updatedProfile = await updateCurrentUserProfile._handler(
    {
      auth: createAuth("user-a"),
      db,
      storage,
    },
    {
      displayName: "  Updated Name  ",
      title: "  Staff Engineer  ",
    },
  );

  for (const profile of [publicProfile, currentUserProfile, updatedProfile]) {
    assert.equal("name" in profile, false);
    assert.equal("email" in profile, false);
    assert.equal("image" in profile, false);
    assert.equal("emailVerificationTime" in profile, false);
    assert.equal("isAnonymous" in profile, false);
    assert.equal("photoStorageId" in profile, false);
    assert.equal("coverStorageId" in profile, false);
  }

  assert.equal(publicProfile.photoURL, "https://cdn.example/photo.png");
  assert.equal(publicProfile.coverURL, "https://cdn.example/cover.png");
  assert.equal(currentUserProfile.displayName, "Public Name");
  assert.equal(updatedProfile.displayName, "Updated Name");
  assert.equal(updatedProfile.title, "Staff Engineer");
});
