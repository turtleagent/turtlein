import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { buildAuthorSummary } from "./helpers";

const normalizeParticipants = (participantIds: Id<"users">[]) => {
  return [...new Set(participantIds)].sort();
};

const sameParticipants = (a: Id<"users">[], b: Id<"users">[]) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((id, index) => id === b[index]);
};

const requireAuthenticatedUserId = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  return userId;
};

const requireConversationParticipant = async (
  ctx: QueryCtx | MutationCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">,
) => {
  const conversation = await ctx.db.get(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (!conversation.participants.includes(userId)) {
    throw new Error("Not authorized to access this conversation");
  }

  return conversation;
};

export const createConversation = mutation({
  args: {
    participantIds: v.array(v.id("users")),
    encryptionKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const normalizedArgs = normalizeParticipants([userId, ...args.participantIds]);
    if (normalizedArgs.length < 2) {
      throw new Error("A conversation must include at least two participants");
    }

    const conversations = await ctx.db.query("conversations").collect();
    const existingConversation = conversations.find((conversation) => {
      const normalizedConversation = normalizeParticipants(conversation.participants);
      return sameParticipants(normalizedConversation, normalizedArgs);
    });

    if (existingConversation) {
      return existingConversation._id;
    }

    const record: {
      participants: typeof args.participantIds;
      createdAt: number;
      encryptionKey?: string;
    } = {
      participants: normalizedArgs,
      createdAt: Date.now(),
    };

    if (args.encryptionKey) {
      record.encryptionKey = args.encryptionKey;
    }

    return await ctx.db.insert("conversations", record);
  },
});

export const getOrCreateConversation = mutation({
  args: {
    participantId: v.id("users"),
    encryptionKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    if (args.participantId === userId) {
      throw new Error("A conversation must include two different users");
    }

    const normalizedArgs = normalizeParticipants([userId, args.participantId]);
    const conversations = await ctx.db.query("conversations").collect();
    const existingConversation = conversations.find((conversation) => {
      const normalizedConversation = normalizeParticipants(conversation.participants);
      return sameParticipants(normalizedConversation, normalizedArgs);
    });

    if (existingConversation) {
      return existingConversation._id;
    }

    const record: {
      participants: Id<"users">[];
      createdAt: number;
      encryptionKey?: string;
    } = {
      participants: normalizedArgs,
      createdAt: Date.now(),
    };

    if (args.encryptionKey) {
      record.encryptionKey = args.encryptionKey;
    }

    return await ctx.db.insert("conversations", record);
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    body: v.string(),
    encrypted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const body = args.body.trim();
    if (!body) {
      throw new Error("Message body is required");
    }

    const conversation = await requireConversationParticipant(
      ctx,
      args.conversationId,
      userId,
    );

    const messageRecord: {
      conversationId: typeof args.conversationId;
      senderId: Id<"users">;
      body: string;
      createdAt: number;
      encrypted?: boolean;
    } = {
      conversationId: args.conversationId,
      senderId: userId,
      body,
      createdAt: Date.now(),
    };

    if (args.encrypted) {
      messageRecord.encrypted = true;
    }

    const messageId = await ctx.db.insert("messages", messageRecord);

    const recipients = conversation.participants.filter(
      (participantId) => participantId !== userId,
    );

    await Promise.all(
      recipients.map((recipientId) =>
        ctx.runMutation(internal.notifications.createNotification, {
          userId: recipientId,
          type: "message",
          fromUserId: userId,
          conversationId: args.conversationId,
        }),
      ),
    );

    return messageId;
  },
});

export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthenticatedUserId(ctx);
    const conversations = await ctx.db.query("conversations").collect();
    const relevantConversations = conversations.filter((conversation) =>
      conversation.participants.includes(userId),
    );

    const conversationsWithDetails = await Promise.all(
      relevantConversations.map(async (conversation) => {
        const otherParticipantId = conversation.participants.find(
          (participantId) => participantId !== userId,
        );

        const otherParticipant = otherParticipantId
          ? await ctx.db.get(otherParticipantId)
          : null;

        const messages = await ctx.db
          .query("messages")
          .filter((q) => q.eq(q.field("conversationId"), conversation._id))
          .collect();

        const latestMessage = [...messages].sort(
          (a, b) => b.createdAt - a.createdAt,
        )[0] ?? null;

        return {
          ...conversation,
          otherParticipant: await buildAuthorSummary(ctx, otherParticipant),
          latestMessage,
          latestMessageCreatedAt: latestMessage
            ? latestMessage.createdAt
            : conversation.createdAt,
        };
      }),
    );

    return conversationsWithDetails.sort(
      (a, b) => b.latestMessageCreatedAt - a.latestMessageCreatedAt,
    );
  },
});

export const listMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);
    await requireConversationParticipant(ctx, args.conversationId, userId);

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .collect();

    const sortedMessages = [...messages].sort((a, b) => a.createdAt - b.createdAt);

    return await Promise.all(
      sortedMessages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          sender: await buildAuthorSummary(ctx, sender),
        };
      }),
    );
  },
});

export const patchConversationKey = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    encryptionKey: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, { encryptionKey: args.encryptionKey });
  },
});

const generateKeyBase64 = async () => {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  const bytes = new Uint8Array(raw);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const listAllConversations = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("conversations").collect();
  },
});

export const backfillEncryptionKeys = action({
  args: {},
  handler: async (ctx): Promise<{ patched: number; total: number }> => {
    const conversations = await ctx.runQuery(internal.messaging.listAllConversations);
    let patched = 0;

    for (const conversation of conversations) {
      if (!conversation.encryptionKey) {
        const encryptionKey = await generateKeyBase64();
        await ctx.runMutation(internal.messaging.patchConversationKey, {
          conversationId: conversation._id,
          encryptionKey,
        });
        patched += 1;
      }
    }

    return { patched, total: conversations.length };
  },
});
