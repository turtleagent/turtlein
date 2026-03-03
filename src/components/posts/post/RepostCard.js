import React from "react";
import Avatar from "@material-ui/core/Avatar";
import ReactTimeago from "react-timeago";
import { getLinkifiedSegmentsFromText } from "./post.utils";

const RepostCard = ({
  classes,
  originalPost,
  postId,
  canNavigateOriginalProfile,
  onOriginalProfileClick,
  resolvePhoto,
  renderMedia,
  originalPostImages,
}) => {
  const originalDescription =
    typeof originalPost?.description === "string" ? originalPost.description : "";
  const descriptionSegments = React.useMemo(
    () => getLinkifiedSegmentsFromText(originalDescription),
    [originalDescription],
  );

  if (!originalPost) {
    return null;
  }

  const originalAuthorDisplayName = originalPost.author?.displayName ?? "Unknown user";

  return (
    <div className={classes.repost__embed}>
      <div className={classes.repost__embedHeader}>
        <Avatar
          className={classes.repost__embedAvatar}
          src={resolvePhoto(originalPost.author?.photoURL)}
          onClick={canNavigateOriginalProfile ? onOriginalProfileClick : undefined}
          style={canNavigateOriginalProfile ? { cursor: "pointer" } : undefined}
        />
        <div className={classes.repost__embedInfo}>
          <h5
            onClick={canNavigateOriginalProfile ? onOriginalProfileClick : undefined}
            style={canNavigateOriginalProfile ? { cursor: "pointer" } : { cursor: "default" }}
          >
            {originalAuthorDisplayName}
          </h5>
          <p>
            <ReactTimeago date={new Date(originalPost.createdAt).toUTCString()} units="minute" />
          </p>
        </div>
      </div>
      {originalDescription.trim().length > 0 && (
        <p className={classes.repost__embedDescription}>
          {descriptionSegments.some((segment) => segment.type === "link")
            ? descriptionSegments.map((segment, index) =>
              segment.type === "link" ? (
                <a
                  key={`repost-link-${postId}-${index}`}
                  className={classes.link}
                  href={segment.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {segment.value}
                </a>
              ) : (
                <React.Fragment key={`repost-text-${postId}-${index}`}>
                  {segment.value}
                </React.Fragment>
              ),
            )
            : originalDescription}
        </p>
      )}
      {renderMedia(
        originalPost.fileType,
        originalPost.fileData,
        originalPostImages,
        `embedded-${postId}`,
      )}
    </div>
  );
};

export default RepostCard;
