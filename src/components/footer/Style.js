import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  root: {
    width: "100%",
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },
  inner: {
    maxWidth: 1128,
    margin: "0 auto",
    padding: theme.spacing(2, 2.5),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(1.25),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(1.5, 1.5),
      justifyContent: "center",
      textAlign: "center",
    },
  },
  links: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(1.25),
    [theme.breakpoints.down("xs")]: {
      justifyContent: "center",
    },
  },
  link: {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: 12,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      color: theme.palette.text.primary,
    },
  },
  copyright: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    fontWeight: 500,
  },
}));

