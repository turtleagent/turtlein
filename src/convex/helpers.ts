import type { Doc, Id } from "./_generated/dataModel";

type UserPhotoContext = {
  storage: {
    getUrl: (storageId: Id<"_storage">) => Promise<string | null>;
  };
};

type UserLookupContext = UserPhotoContext & {
  db: {
    get: (id: Id<"users">) => Promise<Doc<"users"> | null>;
  };
};

export type AuthorSummary = {
  _id: Id<"users">;
  displayName: string;
  photoURL: string;
  title: string;
  username: string;
};

export type SafeUserProfile = Omit<
  Doc<"users">,
  | "name"
  | "email"
  | "image"
  | "emailVerificationTime"
  | "isAnonymous"
  | "photoStorageId"
  | "coverStorageId"
  | "photoURL"
> & {
  photoURL: string;
  coverURL: string;
};

export const resolveUserPhotoURL = async (
  ctx: UserPhotoContext,
  user: Doc<"users">,
) => {
  if (user.photoStorageId) {
    const storagePhotoURL = await ctx.storage.getUrl(user.photoStorageId);
    if (storagePhotoURL) {
      return storagePhotoURL;
    }
  }

  return user.photoURL ?? "";
};

export const resolveUserCoverURL = async (
  ctx: UserPhotoContext,
  user: Doc<"users">,
) => {
  if (!user.coverStorageId) {
    return "";
  }

  const storageCoverURL = await ctx.storage.getUrl(user.coverStorageId);
  return storageCoverURL ?? "";
};

export const buildSafeUserProfile = async (
  ctx: UserPhotoContext,
  user: Doc<"users"> | null,
): Promise<SafeUserProfile | null> => {
  if (!user) {
    return null;
  }

  const {
    name: _name,
    email: _email,
    image: _image,
    emailVerificationTime: _emailVerificationTime,
    isAnonymous: _isAnonymous,
    photoStorageId: _photoStorageId,
    coverStorageId: _coverStorageId,
    photoURL: _photoURL,
    ...safeFields
  } = user;

  return {
    ...safeFields,
    photoURL: await resolveUserPhotoURL(ctx, user),
    coverURL: await resolveUserCoverURL(ctx, user),
  };
};

export const buildAuthorSummary = async (
  ctx: UserPhotoContext,
  author: Doc<"users"> | null,
): Promise<AuthorSummary | null> => {
  if (!author) {
    return null;
  }

  return {
    _id: author._id,
    displayName: author.displayName ?? "TurtleIn User",
    photoURL: await resolveUserPhotoURL(ctx, author),
    title: author.title ?? "",
    username: author.username ?? "",
  };
};

export const buildAuthorSummaryById = async (
  ctx: UserLookupContext,
  authorId: Id<"users">,
) => {
  const author = await ctx.db.get(authorId);
  return buildAuthorSummary(ctx, author);
};
