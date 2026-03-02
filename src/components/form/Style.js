import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  closedCard: {
    width: "100%",
    borderRadius: 12,
    padding: theme.spacing(1.5, 2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      borderRadius: 0,
      boxShadow: "none",
    },
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.25),
  },
  avatar: {
    width: 48,
    height: 48,
    cursor: "pointer",
  },
  startPostButton: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    border: `1px solid ${
      theme.palette.type === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"
    }`,
    backgroundColor: "transparent",
    padding: "0 16px",
    textAlign: "left",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "inherit",
    color: theme.palette.text.secondary,
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    [theme.breakpoints.down("xs")]: {
      height: 42,
      fontSize: 13,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  toolbarButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    border: 0,
    backgroundColor: "transparent",
    borderRadius: 8,
    cursor: "pointer",
    padding: "0 8px",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "& > span": {
      fontSize: 14,
      fontWeight: 600,
      color: theme.palette.text.secondary,
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    [theme.breakpoints.down("xs")]: {
      height: 40,
    },
  },
}));
