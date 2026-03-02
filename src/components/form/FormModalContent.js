import React, { useEffect, useRef } from "react";
import { Avatar, Chip } from "@material-ui/core";
import {
  X,
  Earth,
  Users,
  ChevronDown,
  Smile,
  ImageIcon,
  Video,
  BarChart3,
  Link,
  CirclePlus,
  Clock,
  XCircle,
} from "lucide-react";
import useFormModalStyles from "./FormModalStyles";
import MentionAutocomplete from "../mentions/MentionAutocomplete";

const FormModalContent = ({
  user,
  description,
  files,
  url,
  isUrlOpen,
  isPollOpen,
  pollDraft,
  postVisibility,
  isSubmitting,
  mentionState,
  descriptionInputRef,
  onDescriptionChange,
  onDescriptionCursorChange,
  onMentionSelect,
  onCloseMentions,
  onRemoveFile,
  onUrlChange,
  onClearUrl,
  onToggleUrl,
  onTogglePoll,
  onPollQuestionChange,
  onPollOptionChange,
  onAddPollOption,
  onRemovePollOption,
  onToggleVisibility,
  onSubmit,
  onClose,
  onPhotoClick,
  onVideoClick,
  minPollOptions,
  maxPollOptions,
}) => {
  const classes = useFormModalStyles();
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [description]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const syncDescriptionRef = (el) => {
    textareaRef.current = el;
    if (descriptionInputRef) {
      descriptionInputRef.current = el;
    }
  };

  const hasContent =
    description.trim().length > 0 || files.length > 0 || url.trim().length > 0 || isPollOpen;
  const canSubmit = hasContent && !isSubmitting;

  const visibilityLabel = postVisibility === "public" ? "Post to Anyone" : "Connections Only";
  const VisibilityIcon = postVisibility === "public" ? Earth : Users;

  return (
    <>
      <div className={classes.header}>
        <Avatar className={classes.avatar} src={user?.photoURL} alt={user?.displayName} />
        <div className={classes.headerInfo}>
          <div className={classes.headerName}>{user?.displayName || "User"}</div>
          <button type="button" className={classes.visibilityButton} onClick={onToggleVisibility}>
            <VisibilityIcon size={14} strokeWidth={1.75} />
            {visibilityLabel}
            <ChevronDown size={14} strokeWidth={1.75} />
          </button>
        </div>
        <button type="button" className={classes.closeButton} onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={1.75} />
        </button>
      </div>

      <div className={classes.body}>
        <textarea
          ref={syncDescriptionRef}
          className={classes.textarea}
          placeholder="What do you want to talk about?"
          value={description}
          onChange={onDescriptionChange}
          onClick={onDescriptionCursorChange}
          onKeyUp={onDescriptionCursorChange}
        />

        <MentionAutocomplete
          anchorEl={descriptionInputRef?.current}
          open={mentionState.open}
          query={mentionState.query}
          onSelect={onMentionSelect}
          onClose={onCloseMentions}
        />

        {!isUrlOpen && files.length > 0 && (
          <div className={classes.fileChips}>
            {files.map((file, fileIndex) => (
              <Chip
                key={`${file.name}-${fileIndex}`}
                color="primary"
                size="small"
                onDelete={() => onRemoveFile(fileIndex)}
                icon={
                  file.type === "image" ? (
                    <ImageIcon size={18} strokeWidth={1.75} />
                  ) : (
                    <Video size={18} strokeWidth={1.75} />
                  )
                }
                label={file.name}
              />
            ))}
          </div>
        )}

        {isUrlOpen && (
          <div className={classes.urlInput}>
            <Link size={18} strokeWidth={1.75} />
            <input
              placeholder="Paste an image URL"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
            />
            {url && (
              <XCircle
                size={16}
                strokeWidth={1.75}
                style={{ color: "orange", cursor: "pointer", flexShrink: 0 }}
                onClick={onClearUrl}
              />
            )}
          </div>
        )}

        {isPollOpen && (
          <div className={classes.pollComposer}>
            <label className={classes.pollLabel} htmlFor="poll-question">
              Poll Question
            </label>
            <input
              id="poll-question"
              className={classes.pollInput}
              placeholder="Ask a question..."
              value={pollDraft.question}
              onChange={onPollQuestionChange}
            />
            <div className={classes.pollOptions}>
              {pollDraft.options.map((option, optionIndex) => (
                <div className={classes.pollOptionRow} key={`poll-option-${optionIndex}`}>
                  <input
                    className={classes.pollOptionInput}
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(event) => onPollOptionChange(optionIndex, event.target.value)}
                  />
                  {pollDraft.options.length > minPollOptions && (
                    <button
                      type="button"
                      className={classes.pollRemoveOption}
                      aria-label={`Remove option ${optionIndex + 1}`}
                      onClick={() => onRemovePollOption(optionIndex)}
                    >
                      <XCircle size={18} strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className={classes.pollAddOption}
              onClick={onAddPollOption}
              disabled={pollDraft.options.length >= maxPollOptions}
            >
              <CirclePlus size={16} strokeWidth={1.75} />
              Add option
            </button>
            <p className={classes.pollHint}>Add between 2 and 4 options.</p>
          </div>
        )}
      </div>

      <div className={classes.footer}>
        <div className={classes.footerTools}>
          <button type="button" className={classes.footerToolButton} aria-label="Emoji">
            <Smile size={20} strokeWidth={1.75} />
          </button>

          <div className={classes.footerDivider} />

          <button
            type="button"
            className={classes.footerToolButton}
            onClick={onPhotoClick}
            aria-label="Add photo"
          >
            <ImageIcon size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={classes.footerToolButton}
            onClick={onVideoClick}
            aria-label="Add video"
          >
            <Video size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={`${classes.footerToolButton} ${isPollOpen ? classes.footerToolButtonActive : ""}`}
            onClick={onTogglePoll}
            aria-label={isPollOpen ? "Remove poll" : "Add poll"}
          >
            <BarChart3 size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={`${classes.footerToolButton} ${isUrlOpen ? classes.footerToolButtonActive : ""}`}
            onClick={onToggleUrl}
            aria-label="Add URL"
          >
            <Link size={20} strokeWidth={1.75} />
          </button>
          <button type="button" className={classes.footerToolButton} aria-label="More">
            <CirclePlus size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className={classes.footerRight}>
          <button type="button" className={classes.footerToolButton} aria-label="Schedule">
            <Clock size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={classes.postButton}
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </>
  );
};

export default FormModalContent;
