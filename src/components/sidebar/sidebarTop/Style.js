import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  profileCard: {
    borderRadius: 12,
    overflow: "hidden",
    paddingBottom: 12,
  },
  cover: {
    width: "100%",
    height: 60,
    opacity: 0.75,
  },
  profileBody: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "0 12px",
  },
  avatar: {
    width: 72,
    height: 72,
    marginTop: -36,
    border: `3px solid ${theme.palette.background.paper}`,
  },
  displayName: {
    margin: "8px 0 0",
    fontSize: 16,
    fontWeight: 600,
  },
  subtitle: {
    margin: "2px 0 0",
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
  statsCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  stat: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    color: theme.palette.text.secondary,
    padding: "10px 12px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "& > h4": {
      fontSize: 14,
      fontWeight: 400,
      color: theme.palette.text.secondary,
    },
    "& > p": {
      fontSize: 12,
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  actionsCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
  actionItem: {
    width: "100%",
    height: 46,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    paddingLeft: 12,
    color: theme.palette.text.primary,
    transition: "background-color 0.2s ease",
    "& > h4": {
      fontSize: 14,
      fontWeight: 500,
      marginLeft: 10,
    },
    "& > svg": {
      width: 20,
      height: 20,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  actionLink: {
    width: "100%",
    textDecoration: "none",
    color: "inherit",
  },
}));
