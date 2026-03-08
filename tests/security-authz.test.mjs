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
    collect: async () => docs.map((doc) => ({ ...doc })),
  };
}

function createDb(seed = {}) {
  const tables = {
    conversations: (seed.conversations ?? []).map((doc) => ({ ...doc })),
    messages: (seed.messages ?? []).map((doc) => ({ ...doc })),
    notifications: (seed.notifications ?? []).map((doc) => ({ ...doc })),
    users: (seed.users ?? []).map((doc) => ({ ...doc })),
  };

  const patchCalls = [];

  const findDocument = (id) => {
    for (const docs of Object.values(tables)) {
      const document = docs.find((candidate) => candidate._id === id);
      if (document) {
        return document;
      }
    }

    return null;
  };

  return {
    patchCalls,
    tables,
    get: async (id) => findDocument(id),
    patch: async (id, patchValue) => {
      const document = findDocument(id);
      if (!document) {
        throw new Error(`Document not found: ${id}`);
      }

      Object.assign(document, patchValue);
      patchCalls.push({ id, patch: { ...patchValue } });
    },
    query: (table) => createQuery(tables[table] ?? []),
  };
}

function createStorage(urls = {}) {
  return {
    getUrl: async (storageId) => urls[storageId] ?? null,
  };
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
