import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  menuItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: theme.palette.text.secondary,
    cursor: "pointer",
    transition: "color 0.2s ease",
    "& > .MuiSvgIcon-root": {
      fontSize: 24,
    },
    "& > .MuiAvatar-root": {
      width: 24,
      height: 24,
    },
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 2px",
    "& > p": {
      fontSize: 12,
      fontWeight: 400,
    },
    "& > .MuiSvgIcon-root": {
      fontSize: 20,
      padding: 0,
      margin: -5,
      marginLeft: 0,
    },
  },
}));
