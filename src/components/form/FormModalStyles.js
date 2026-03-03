import { fade, makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.25),
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerName: {
    fontWeight: 700,
    fontSize: 16,
    color: theme.palette.text.primary,
    lineHeight: 1.3,
  },
  visibilityButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    border: 0,
    background: "none",
    padding: "2px 0",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  avatar: {
    width: 48,
    height: 48,
  },

  body: {
    padding: theme.spacing(2, 3),
    minHeight: 200,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1.5, 2),
    },
  },
  textarea: {
    width: "100%",
    border: 0,
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    fontSize: 16,
    lineHeight: 1.5,
    color: theme.palette.text.primary,
    backgroundColor: "transparent",
    minHeight: 120,
    "&::placeholder": {
      color: theme.palette.text.secondary,
    },
  },

  fileChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },

  imagePreviewSection: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  imagePreviewLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  imagePreviewGrid: {
    width: "100%",
    display: "grid",
    gap: 8,
  },
  imagePreviewGrid1: {
    gridTemplateColumns: "1fr",
  },
  imagePreviewGrid2: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  imagePreviewGrid3: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  imagePreviewGrid4: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  imagePreviewItem: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor:
      theme.palette.type === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    aspectRatio: "1 / 1",
    "& > img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
  imagePreviewRemove: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 999,
    border: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  },

  urlInput: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px dashed ${
      theme.palette.type === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"
    }`,
    "& > input": {
      flex: 1,
      border: 0,
      outline: "none",
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      fontSize: 13,
      fontFamily: "inherit",
      "&::placeholder": {
        color: theme.palette.text.secondary,
      },
    },
  },

  pollComposer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 10,
    border:
      theme.palette.type === "dark"
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.1)",
    backgroundColor:
      theme.palette.type === "dark"
        ? "rgba(255,255,255,0.04)"
        : fade(theme.palette.primary.main, 0.04),
  },
  pollLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: theme.palette.type === "dark" ? "rgba(255,255,255,0.9)" : theme.palette.primary.dark,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  pollInput: {
    width: "100%",
    border: 0,
    outline: "none",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.type === "dark" ? "rgba(0,0,0,0.25)" : "#fff",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  pollOptions: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  pollOptionRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  pollOptionInput: {
    flex: 1,
    border: 0,
    outline: "none",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.type === "dark" ? "rgba(0,0,0,0.25)" : "#fff",
    fontFamily: "inherit",
  },
  pollRemoveOption: {
    width: 32,
    height: 32,
    border: 0,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: theme.palette.type === "dark" ? "#f5b5b5" : "#c62828",
    backgroundColor:
      theme.palette.type === "dark" ? "rgba(255,255,255,0.08)" : "rgba(198,40,40,0.08)",
  },
  pollAddOption: {
    width: "fit-content",
    border: 0,
    outline: "none",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
    fontFamily: "inherit",
    color: theme.palette.type === "dark" ? "#a5d6a7" : theme.palette.primary.dark,
    backgroundColor:
      theme.palette.type === "dark"
        ? fade(theme.palette.primary.main, 0.2)
        : fade(theme.palette.primary.main, 0.15),
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.6,
    },
  },
  pollHint: {
    margin: 0,
    fontSize: 12,
    color: theme.palette.type === "dark" ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1, 2),
    borderTop: `1px solid ${theme.palette.divider}`,
    gap: theme.spacing(1),
  },
  footerTools: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  footerToolButton: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.secondary,
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
  },
  footerToolButtonActive: {
    color: theme.palette.primary.main,
    backgroundColor: fade(theme.palette.primary.main, 0.08),
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
    },
  },
  footerDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.palette.divider,
    margin: theme.spacing(0, 0.5),
  },
  footerRight: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  postButton: {
    height: 36,
    borderRadius: 999,
    border: 0,
    padding: "0 20px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background-color 0.15s ease",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&:disabled": {
      backgroundColor:
        theme.palette.type === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
      color: theme.palette.type === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
      cursor: "not-allowed",
    },
  },
}));
