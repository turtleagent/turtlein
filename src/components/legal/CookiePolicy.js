import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  page: {
    width: "100%",
    padding: theme.spacing(1, 0, 3),
  },
  card: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
    borderRadius: 12,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
    "@media (max-width:767px)": {
      padding: theme.spacing(2),
    },
  },
  title: {
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
  subtitle: {
    marginTop: theme.spacing(0.75),
    color: theme.palette.text.secondary,
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
  paragraph: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  bulletList: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
    paddingLeft: theme.spacing(2.5),
    color: theme.palette.text.primary,
  },
  bulletItem: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  finePrint: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
    lineHeight: 1.6,
  },
}));

const CookiePolicy = () => {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <Paper elevation={0} className={classes.card}>
        <Typography variant="h4" className={classes.title} gutterBottom>
          Cookie Policy
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          Effective date: March 3, 2026
        </Typography>
        <Typography variant="body2" className={classes.finePrint}>
          TurtleIn is a demo LinkedIn-style social networking app. This Cookie Policy is provided for
          informational purposes and is not legal advice.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          1. Overview
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          This Cookie Policy explains how TurtleIn ("we", "us") uses cookies and similar technologies
          to operate the service, remember preferences, and keep you signed in.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          2. What are cookies?
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Cookies are small text files stored on your device by your browser. We may also use similar
          storage technologies (like localStorage) to remember preferences.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          3. Cookies and storage we use
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn currently uses limited cookies/storage for core functionality:
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.bulletItem}>
            <strong>Authentication/session:</strong> to keep you signed in and to secure access to
            your account.
          </li>
          <li className={classes.bulletItem}>
            <strong>Preferences:</strong> to remember settings such as theme (e.g., dark mode) and
            other UI preferences.
          </li>
          <li className={classes.bulletItem}>
            <strong>Cookie consent preference:</strong> if you interact with a cookie notice, we may
            store your choice locally (for example via localStorage) so we don’t show it repeatedly.
          </li>
        </ul>

        <Typography variant="h6" className={classes.sectionTitle}>
          4. Essential vs. non-essential cookies
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Essential cookies</strong> are necessary for TurtleIn to function (for example,
          sign-in and security). Without them, key features may not work.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          <strong>Non-essential cookies</strong> (such as analytics or advertising cookies) are not
          currently used for this demo by default. If we add optional cookies in the future, we will
          update this policy and (where required) ask for your consent.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          5. How to manage cookies
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          You can control cookies through your browser settings (for example, blocking or deleting
          cookies). You can also clear site data (including localStorage) for TurtleIn in your
          browser. Please note that disabling cookies may sign you out or prevent the service from
          working correctly.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          6. Contact
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          For questions about this Cookie Policy, contact us at{" "}
          <a href="mailto:legal@turtlein.example">legal@turtlein.example</a>.
        </Typography>
      </Paper>
    </div>
  );
};

export default CookiePolicy;

