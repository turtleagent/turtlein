import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { DEFAULT_PHOTO } from "../constants";

const useConvexUser = () => {
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  if (!isAuthenticated) {
    return null;
  }

  if (currentUser) {
    return {
      ...currentUser,
      displayName: currentUser.displayName ?? "TurtleIn User",
      photoURL: currentUser.photoURL ?? DEFAULT_PHOTO,
    };
  }

  return null;
};

export default useConvexUser;
