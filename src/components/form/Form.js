import React, { useEffect, useRef, useState } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { Snackbar, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Alert from "@material-ui/lab/Alert";
import FormClosedCard from "./FormClosedCard";
import FormModalContent from "./FormModalContent";
import { imageUploadHandler } from "./form.utils";
import { api } from "../../convex/_generated/api";
import useConvexUser from "../../hooks/useConvexUser";

const MAX_POST_IMAGES = 4;
const MIN_POLL_OPTIONS = 2;
const MAX_POLL_OPTIONS = 4;
const MENTION_TRIGGER_REGEX = /(^|\s)@([a-z0-9-]*)$/i;

const getNormalizedPollPayload = (pollDraft) => {
  const question = pollDraft.question.trim();
  const options = pollDraft.options
    .map((option) => option.trim())
    .filter((option) => option.length > 0);

  return { question, options };
};

const getActiveMention = (value, caretPosition) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedCaretPosition =
    typeof caretPosition === "number" ? caretPosition : value.length;
  const textBeforeCursor = value.slice(0, normalizedCaretPosition);
  const match = textBeforeCursor.match(MENTION_TRIGGER_REGEX);

  if (!match) {
    return null;
  }

  const tokenStart = (match.index ?? 0) + (match[1] ? match[1].length : 0);
  return {
    query: match[2] ?? "",
    start: tokenStart,
    end: normalizedCaretPosition,
  };
};

const Form = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const createPost = useMutation(api.posts.createPost);
  const createPoll = useMutation(api.polls.createPoll);
  const generateImageUploadUrl = useMutation(api.posts.generateImageUploadUrl);
  const { isAuthenticated } = useConvexAuth();
  const user = useConvexUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ description: "", files: [] });
  const [openURL, setOpenURL] = useState(false);
  const [URL, setURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postVisibility, setPostVisibility] = useState("public");
  const [isPollComposerOpen, setIsPollComposerOpen] = useState(false);
  const [pollDraft, setPollDraft] = useState({ question: "", options: ["", ""] });
  const [mentionState, setMentionState] = useState({
    open: false,
    query: "",
    start: -1,
    end: -1,
  });
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 4000,
  });

  const descriptionInputRef = useRef(null);
  const pendingActionRef = useRef(null);

  // Deferred action: when the modal opens after a toolbar click, trigger the file input
  useEffect(() => {
    if (isModalOpen && pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      requestAnimationFrame(() => {
        const targetId = action === "photo" ? "upload-image" : "upload-video";
        document.getElementById(targetId)?.click();
      });
    }
  }, [isModalOpen]);

  const showSnackbar = (message, severity = "info", autoHideDuration = 4000) => {
    setSnackbarState({ open: true, message, severity, autoHideDuration });
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  const closeMentionAutocomplete = () => {
    setMentionState({ open: false, query: "", start: -1, end: -1 });
  };

  const resetPollDraft = () => {
    setPollDraft({ question: "", options: ["", ""] });
  };

  const updateMentionState = (value, caretPosition) => {
    const activeMention = getActiveMention(value, caretPosition);
    if (!activeMention || !activeMention.query) {
      closeMentionAutocomplete();
      return;
    }
    setMentionState({ open: true, ...activeMention });
  };

  const handleDescriptionChange = (event) => {
    const nextDescription = event.target.value;
    const caretPosition = event.target.selectionStart;
    setUploadData((prev) => ({ ...prev, description: nextDescription }));
    updateMentionState(nextDescription, caretPosition);
  };

  const handleDescriptionCursorChange = (event) => {
    updateMentionState(event.target.value, event.target.selectionStart);
  };

  const handleMentionSelect = (selectedUser) => {
    if (!selectedUser?.username) {
      closeMentionAutocomplete();
      return;
    }

    const mentionStart = mentionState.start;
    const mentionEnd = mentionState.end;
    if (mentionStart < 0 || mentionEnd < mentionStart) {
      closeMentionAutocomplete();
      return;
    }

    const currentDescription = uploadData.description;
    const mentionText = `@${selectedUser.username} `;
    const nextDescription = `${currentDescription.slice(0, mentionStart)}${mentionText}${currentDescription.slice(mentionEnd)}`;
    const nextCursorPosition = mentionStart + mentionText.length;

    setUploadData((prev) => ({ ...prev, description: nextDescription }));
    closeMentionAutocomplete();

    requestAnimationFrame(() => {
      if (descriptionInputRef.current) {
        descriptionInputRef.current.focus();
        descriptionInputRef.current.setSelectionRange(nextCursorPosition, nextCursorPosition);
      }
    });
  };

  const resetState = () => {
    setUploadData({ description: "", files: [] });
    setOpenURL(false);
    setURL("");
    setPostVisibility("public");
    setIsPollComposerOpen(false);
    resetPollDraft();
    closeMentionAutocomplete();
  };

  const handleClose = () => {
    const hasContent =
      uploadData.description.trim() ||
      uploadData.files.length > 0 ||
      URL.trim() ||
      isPollComposerOpen;

    if (hasContent) {
      const shouldDiscard = window.confirm("Discard this post?");
      if (!shouldDiscard) {
        return;
      }
    }

    resetState();
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (isSubmitting) {
      return;
    }

    const description = uploadData.description.trim();

    if (!description && uploadData.files.length === 0 && !URL) {
      showSnackbar("Please enter something", "warning");
      return;
    }

    if (!user?._id) {
      showSnackbar("User profile is still loading.", "warning");
      return;
    }

    const shouldCreatePoll = isPollComposerOpen;
    const normalizedPollPayload = shouldCreatePoll ? getNormalizedPollPayload(pollDraft) : null;

    if (shouldCreatePoll && !normalizedPollPayload.question) {
      showSnackbar("Please add a poll question.", "warning");
      return;
    }

    if (
      shouldCreatePoll &&
      (normalizedPollPayload.options.length < MIN_POLL_OPTIONS ||
        normalizedPollPayload.options.length > MAX_POLL_OPTIONS)
    ) {
      showSnackbar("Poll must include between 2 and 4 options.", "warning");
      return;
    }

    if (URL !== "") {
      if (URL.startsWith("data")) {
        showSnackbar("DATA-URL format is not allowed", "warning");
        setURL("");
        return;
      }
      if (URL.includes("youtu.be") || URL.includes("youtube")) {
        showSnackbar("Youtube videos are not allowed", "warning");
        setURL("");
        return;
      }
      if (!URL.startsWith("http")) {
        showSnackbar("Please enter valid image url", "warning");
        setURL("");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const payload = {
        authorId: user._id,
        description,
        visibility: postVisibility,
      };

      const selectedFiles = uploadData.files;
      const selectedImageFiles = selectedFiles.filter(
        (file) => file.type === "image" && Boolean(file.blob),
      );

      if (selectedImageFiles.length > 0 && !URL) {
        const uploadedStorageIds = await Promise.all(
          selectedImageFiles.map(async (file) => {
            const uploadUrl = await generateImageUploadUrl({});
            const uploadResponse = await fetch(uploadUrl, {
              method: "POST",
              headers: { "Content-Type": file.blob.type || "application/octet-stream" },
              body: file.blob,
            });

            if (!uploadResponse.ok) {
              throw new Error("Image upload failed");
            }

            const uploadResult = await uploadResponse.json();
            if (!uploadResult.storageId) {
              throw new Error("Missing uploaded image storage ID");
            }

            return uploadResult.storageId;
          }),
        );

        payload.imageStorageIds = uploadedStorageIds;
      } else {
        const selectedFile = selectedFiles[0];
        const fileType = URL ? "image" : selectedFile?.type || undefined;
        const fileData = URL || selectedFile?.data || undefined;
        if (fileType) {
          payload.fileType = fileType;
        }
        if (fileData) {
          payload.fileData = fileData;
        }
      }

      const postId = await createPost(payload);

      if (shouldCreatePoll && normalizedPollPayload) {
        await createPoll({
          postId,
          question: normalizedPollPayload.question,
          options: normalizedPollPayload.options,
        });
      }

      resetState();
      setIsModalOpen(false);
      showSnackbar("Post created!", "success", 1500);
    } catch (error) {
      console.error("Failed to create post:", error);
      showSnackbar("Unable to publish your post right now.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== indexToRemove),
    }));
  };

  const toggleURL = () => {
    if (uploadData.files.length > 0) {
      setOpenURL(false);
    } else if (URL === "") {
      setOpenURL((prev) => !prev);
    } else {
      setOpenURL(true);
    }
  };

  const togglePollComposer = () => {
    setIsPollComposerOpen((prev) => {
      const next = !prev;
      if (!next) {
        resetPollDraft();
      }
      return next;
    });
  };

  const toggleVisibility = () => {
    setPostVisibility((prev) => (prev === "public" ? "connections" : "public"));
  };

  const handlePollQuestionChange = (event) => {
    setPollDraft((prev) => ({ ...prev, question: event.target.value }));
  };

  const handlePollOptionChange = (optionIndex, nextValue) => {
    setPollDraft((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === optionIndex ? nextValue : opt)),
    }));
  };

  const addPollOption = () => {
    setPollDraft((prev) => {
      if (prev.options.length >= MAX_POLL_OPTIONS) {
        return prev;
      }
      return { ...prev, options: [...prev.options, ""] };
    });
  };

  const removePollOption = (optionIndex) => {
    setPollDraft((prev) => {
      if (prev.options.length <= MIN_POLL_OPTIONS) {
        return prev;
      }
      return { ...prev, options: prev.options.filter((_, i) => i !== optionIndex) };
    });
  };

  // Closed card callbacks
  const openModal = () => setIsModalOpen(true);

  const openModalWithAction = (action) => {
    pendingActionRef.current = action;
    setIsModalOpen(true);
  };

  const onWriteArticle = () => navigate("/write-article");

  if (!isAuthenticated || !user?._id) {
    return null;
  }

  return (
    <>
      <FormClosedCard
        user={user}
        onStartPost={openModal}
        onPhotoClick={() => openModalWithAction("photo")}
        onVideoClick={() => openModalWithAction("video")}
        onWriteArticle={onWriteArticle}
      />

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={isXs}
        scroll="body"
        PaperProps={{ style: { overflow: "visible", borderRadius: isXs ? 0 : 12 } }}
      >
        <input
          id="upload-image"
          type="file"
          accept="image/*"
          hidden
          multiple
          onChange={(e) => {
            imageUploadHandler(e, "image", setUploadData, { maxImageCount: MAX_POST_IMAGES });
            setOpenURL(false);
            setURL("");
          }}
        />
        <input
          id="upload-video"
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => {
            imageUploadHandler(e, "video", setUploadData);
            setOpenURL(false);
          }}
        />

        <FormModalContent
          user={user}
          description={uploadData.description}
          files={uploadData.files}
          url={URL}
          isUrlOpen={openURL}
          isPollOpen={isPollComposerOpen}
          pollDraft={pollDraft}
          postVisibility={postVisibility}
          isSubmitting={isSubmitting}
          mentionState={mentionState}
          descriptionInputRef={descriptionInputRef}
          onDescriptionChange={handleDescriptionChange}
          onDescriptionCursorChange={handleDescriptionCursorChange}
          onMentionSelect={handleMentionSelect}
          onCloseMentions={closeMentionAutocomplete}
          onRemoveFile={handleRemoveFile}
          onUrlChange={setURL}
          onClearUrl={() => setURL("")}
          onToggleUrl={toggleURL}
          onTogglePoll={togglePollComposer}
          onPollQuestionChange={handlePollQuestionChange}
          onPollOptionChange={handlePollOptionChange}
          onAddPollOption={addPollOption}
          onRemovePollOption={removePollOption}
          onToggleVisibility={toggleVisibility}
          onSubmit={handleSubmit}
          onClose={handleClose}
          onPhotoClick={() => document.getElementById("upload-image")?.click()}
          onVideoClick={() => document.getElementById("upload-video")?.click()}
          minPollOptions={MIN_POLL_OPTIONS}
          maxPollOptions={MAX_POLL_OPTIONS}
        />
      </Dialog>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={snackbarState.autoHideDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity} variant="filled">
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Form;
