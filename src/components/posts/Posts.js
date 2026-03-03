import React from "react";
import { useQuery } from "convex/react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FlipMove from "react-flip-move";
import { ChevronDown } from "lucide-react";
import Post from "./post/Post";
import { DEFAULT_PHOTO } from "../../constants";
import { api } from "../../convex/_generated/api";
import useConvexPosts from "../../hooks/useConvexPosts";
import useConvexUser from "../../hooks/useConvexUser";
import LoadingGate from "../LoadingGate";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "top", label: "Most relevant first" },
  { value: "recent", label: "Most recent first" },
  { value: "following", label: "Following" },
];

const Posts = ({ onNavigateProfile }) => {
  const classes = Style();
  const [sortBy, setSortBy] = React.useState("top");
  const [isSortOpen, setIsSortOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [pagedPosts, setPagedPosts] = React.useState({});
  const offset = page * PAGE_SIZE;
  const currentPagePosts = useConvexPosts(sortBy, { offset, limit: PAGE_SIZE });
  const user = useConvexUser();
  const posts = React.useMemo(() => {
    const pageIndexes = Object.keys(pagedPosts)
      .map((pageIndex) => Number(pageIndex))
      .sort((a, b) => a - b);

    return pageIndexes.flatMap((pageIndex) => pagedPosts[pageIndex] ?? []);
  }, [pagedPosts]);

  const isLoading = page === 0 && currentPagePosts === undefined && !Array.isArray(pagedPosts[0]);
  const isLoadingMore = page > 0 && currentPagePosts === undefined;
  const currentLoadedPagePosts = pagedPosts[page];
  const hasMore = Array.isArray(currentLoadedPagePosts)
    ? currentLoadedPagePosts.length === PAGE_SIZE
    : true;

  React.useEffect(() => {
    if (!Array.isArray(currentPagePosts)) {
      return;
    }

    setPagedPosts((previousPages) => ({
      ...previousPages,
      [page]: currentPagePosts,
    }));
  }, [currentPagePosts, page]);

  const postIds = React.useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) {
      return [];
    }

    const seenPostIds = new Set();
    const resolvedPostIds = [];

    for (const post of posts) {
      const targetPostId = post.targetPostId ?? post._id;
      if (!targetPostId || seenPostIds.has(targetPostId)) {
        continue;
      }

      seenPostIds.add(targetPostId);
      resolvedPostIds.push(targetPostId);
    }

    return resolvedPostIds;
  }, [posts]);

  const userReactions = useQuery(
    api.likes.getUserReactionsByPostIds,
    user?._id && postIds.length > 0 ? { userId: user._id, postIds } : "skip",
  );
  const reactionCounts = useQuery(
    api.likes.getReactionCountsByPostIds,
    postIds.length > 0 ? { postIds } : "skip",
  );

  const getProfilePhoto = (photoURL) => {
    if (!photoURL || (typeof photoURL === "string" && photoURL.startsWith("/"))) {
      return DEFAULT_PHOTO;
    }
    return photoURL;
  };

  const activeLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ?? "Most relevant first";

  const handleSortSelect = (value) => {
    if (value !== sortBy) {
      setSortBy(value);
      setPage(0);
      setPagedPosts({});
    }
    setIsSortOpen(false);
  };

  return (
    <div className={classes.posts}>
      <div className={classes.sortRow}>
        <div className={classes.sortDivider} />
        <div className={classes.sortTriggerWrapper}>
          <div
            className={classes.sortTrigger}
            onClick={() => setIsSortOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsSortOpen((prev) => !prev);
              }
            }}
          >
            <span>Select feed view:</span>
            <span className={classes.sortTriggerValue}>
              {activeLabel}
              <ChevronDown
                size={16}
                strokeWidth={1.75}
                style={{
                  transform: isSortOpen ? "rotate(180deg)" : "",
                  transition: "transform 0.2s ease",
                }}
              />
            </span>
          </div>
          {isSortOpen && (
            <ClickAwayListener onClickAway={() => setIsSortOpen(false)}>
              <Paper className={classes.sortDropdown} elevation={3}>
                {SORT_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`${classes.sortOption} ${
                      option.value === sortBy ? classes.sortOptionActive : ""
                    }`}
                    onClick={() => handleSortSelect(option.value)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSortSelect(option.value);
                      }
                    }}
                  >
                    {option.label}
                  </div>
                ))}
                <p className={classes.sortNote}>
                  This selection only affects your current feed view on this device.
                </p>
              </Paper>
            </ClickAwayListener>
          )}
        </div>
      </div>
      <LoadingGate isLoading={isLoading}>
        {posts.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No posts yet.
          </Typography>
        ) : (
          <FlipMove style={{ width: "100%" }}>
            {posts?.map((post) => (
              <Post
                key={post.feedItemId ?? post._id}
                postId={post.targetPostId ?? post._id}
                authorId={post.authorId}
                authorUsername={post.author?.username ?? null}
                likesCount={post.likesCount}
                commentsCount={post.commentsCount}
                repostCount={post.repostCount}
                currentReaction={userReactions?.[post.targetPostId ?? post._id] ?? undefined}
                reactionCounts={reactionCounts?.[post.targetPostId ?? post._id]}
                profile={getProfilePhoto(post.authorPhotoURL ?? post.author?.photoURL)}
                username={post.authorName ?? post.author?.displayName}
                timestamp={post.createdAt}
                isEdited={Boolean(post.isEdited)}
                description={post.description}
                postType={post.type ?? "post"}
                articleTitle={post.articleTitle}
                articleBody={post.articleBody}
                fileType={post.fileType}
                fileData={post.fileData}
                imageUrls={post.imageUrls}
                isRepost={post.feedItemType === "repost"}
                originalPost={post.originalPost ?? null}
                onNavigateProfile={onNavigateProfile}
              />
            ))}
          </FlipMove>
        )}
        {posts.length > 0 && hasMore && (
          <div className={classes.loadMoreContainer}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setPage((previousPage) => previousPage + 1)}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}
      </LoadingGate>
    </div>
  );
};

const Style = makeStyles((theme) => ({
  posts: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sortRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "8px 0 2px",
  },
  sortDivider: {
    flex: 1,
    height: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  sortTriggerWrapper: {
    position: "relative",
    flexShrink: 0,
  },
  sortTrigger: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    fontSize: 12,
    lineHeight: 1,
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    userSelect: "none",
  },
  sortTriggerValue: {
    display: "inline-flex",
    alignItems: "center",
    gap: 2,
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  sortDropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 260,
    zIndex: 1000,
    borderRadius: 8,
    padding: "4px 0",
    backgroundColor: theme.palette.background.paper,
  },
  sortOption: {
    padding: "10px 16px",
    fontSize: 14,
    color: theme.palette.text.primary,
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  sortOptionActive: {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  sortNote: {
    padding: "8px 16px 12px",
    margin: 0,
    fontSize: 12,
    lineHeight: 1.4,
    color: theme.palette.text.secondary,
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: 4,
  },
  loadMoreContainer: {
    marginTop: 12,
    marginBottom: 8,
    display: "flex",
    justifyContent: "center",
  },
}));

export default Posts;
