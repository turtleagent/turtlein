import React from "react";
import { useMutation, useQuery } from "convex/react";
import Avatar from "@material-ui/core/Avatar";
import { Trash2 } from "lucide-react";
import ReactTimeago from "react-timeago";
import { api } from "../../../convex/_generated/api";
import MentionAutocomplete from "../../mentions/MentionAutocomplete";

const MENTION_TRIGGER_REGEX = /(^|\s)@([a-z0-9-]*)$/i;

const getActiveMention = (value, caretPosition) => {
  if (typeof value !== "string") return null;
  const pos = typeof caretPosition === "number" ? caretPosition : value.length;
  const textBefore = value.slice(0, pos);
  const match = textBefore.match(MENTION_TRIGGER_REGEX);
  if (!match) return null;
  const tokenStart = (match.index ?? 0) + (match[1] ? match[1].length : 0);
  return { query: match[2] ?? "", start: tokenStart, end: pos };
};

const PostComments = ({
  classes,
  postId,
  canInteract,
  currentUserId,
  resolvePhoto,
  onError,
}) => {
  const addComment = useMutation(api.comments.addComment);
  const deleteComment = useMutation(api.comments.deleteComment);
  const comments = useQuery(api.comments.listComments, { postId });
  const [commentText, setCommentText] = React.useState("");
  const [mentionState, setMentionState] = React.useState({
    open: false,
    query: "",
    start: -1,
    end: -1,
  });
  const commentInputRef = React.useRef(null);
  const commentsList = comments ?? [];

  const closeMention = () =>
    setMentionState({ open: false, query: "", start: -1, end: -1 });

  const updateMention = (value, caretPosition) => {
    const active = getActiveMention(value, caretPosition);
    if (!active || !active.query) {
      closeMention();
      return;
    }
    setMentionState({ open: true, ...active });
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
    updateMention(event.target.value, event.target.selectionStart);
  };

  const handleMentionSelect = (selectedUser) => {
    if (!selectedUser?.username) {
      closeMention();
      return;
    }
    const { start, end } = mentionState;
    if (start < 0 || end < start) {
      closeMention();
      return;
    }
    const mentionText = `@${selectedUser.username} `;
    const next = `${commentText.slice(0, start)}${mentionText}${commentText.slice(end)}`;
    const nextCursor = start + mentionText.length;
    setCommentText(next);
    closeMention();
    requestAnimationFrame(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
        commentInputRef.current.setSelectionRange(nextCursor, nextCursor);
      }
    });
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!canInteract || !currentUserId) {
      return;
    }

    const body = commentText.trim();
    if (!body) {
      return;
    }

    try {
      await addComment({ postId, authorId: currentUserId, body });
      setCommentText("");
      closeMention();
    } catch (error) {
      console.error("Failed to add comment:", error);
      onError("Failed to save comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUserId) {
      return;
    }

    await deleteComment({ commentId, userId: currentUserId });
  };

  return (
    <div className={classes.comments__section}>
      <div className={classes.comments__list}>
        {commentsList.map((comment) => (
          <div key={comment._id} className={classes.comment__item}>
            <Avatar
              className={classes.comment__avatar}
              src={resolvePhoto(comment.author?.photoURL)}
              alt={comment.author?.displayName ?? "Comment author"}
            />
            <div className={classes.comment__content}>
              <div className={classes.comment__meta}>
                <h5>{comment.author?.displayName ?? "Unknown user"}</h5>
                <span>
                  <ReactTimeago
                    date={new Date(comment.createdAt).toUTCString()}
                    units="minute"
                  />
                </span>
                {currentUserId && comment.authorId === currentUserId && (
                  <Trash2
                    size={16}
                    strokeWidth={1.75}
                    className={classes.comment__delete}
                    onClick={() => handleDeleteComment(comment._id)}
                    aria-label="Delete comment"
                  />
                )}
              </div>
              <p>{comment.body}</p>
            </div>
          </div>
        ))}
      </div>

      {canInteract && (
        <div style={{ position: "relative" }}>
          <form className={classes.comment__form} onSubmit={handleCommentSubmit}>
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={handleCommentChange}
              onClick={(e) =>
                updateMention(e.target.value, e.target.selectionStart)
              }
              onKeyUp={(e) =>
                updateMention(e.target.value, e.target.selectionStart)
              }
              placeholder="Add a comment"
              aria-label="Add a comment"
            />
            <button type="submit" disabled={!commentText.trim()}>
              Send
            </button>
          </form>
          <MentionAutocomplete
            anchorEl={commentInputRef.current}
            open={mentionState.open}
            query={mentionState.query}
            onSelect={handleMentionSelect}
            onClose={closeMention}
          />
        </div>
      )}
    </div>
  );
};

export default PostComments;
