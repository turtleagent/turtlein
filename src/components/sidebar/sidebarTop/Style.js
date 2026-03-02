import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  sidebar: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    "& > .MuiAvatar-root": {
      width: "30%",
      height: "auto",
      marginTop: -40,
    },
    "& > h4": {
      margin: "10px 0",
    },
  },
  subtitle: {
    margin: "-6px 0 8px",
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
  cover: {
    width: "100%",
    height: "60px",
    opacity: 0.75,
  },
  stats: {
    width: "100%",
    "& > *": { marginTop: 5 },
  },
  stat: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    color: theme.palette.text.secondary,
    padding: "5px 10px",
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
  myItems: {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    paddingLeft: 10,
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
  savedPostsLink: {
    width: "100%",
    textDecoration: "none",
    color: "inherit",
  },
}));
