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
          Effective date: March 8, 2026
        </Typography>
        <Typography variant="body2" className={classes.finePrint}>
          TurtleIn is a demo LinkedIn-style social networking app. This Cookie Policy is provided for
          informational purposes and is not legal advice.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          1. Overview
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          This Cookie Policy explains how TurtleIn ("we", "us") uses cookies and similar browser
          storage to run sign-in and security flows, store limited on-device convenience data, and
          remember your cookie-notice response.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          2. What are cookies?
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Cookies are small text files stored on your device by your browser. We also use browser
          storage technologies such as localStorage to keep a small amount of app data on your
          device.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          3. Cookies and storage we use
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn currently uses the following cookies and storage:
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.bulletItem}>
            <strong>Authentication tokens in localStorage:</strong> Convex Auth stores browser
            access/refresh tokens in localStorage so your session can persist between page loads.
          </li>
          <li className={classes.bulletItem}>
            <strong>OAuth security cookies:</strong> short-lived cookies are set during Google or
            GitHub sign-in to store PKCE/state/nonce values and protect the login flow from
            tampering.
          </li>
          <li className={classes.bulletItem}>
            <strong>Recent searches:</strong> we store up to five recent search terms in
            localStorage so the header search box can show your recent history on that device.
          </li>
          <li className={classes.bulletItem}>
            <strong>Cookie notice state:</strong> we store whether you acknowledged the cookie
            notice and, if you open the manage dialog, the preference you choose about future
            optional analytics tools. Today that preference does not turn on analytics cookies
            because TurtleIn does not currently deploy analytics or advertising cookies.
          </li>
        </ul>

        <Typography variant="h6" className={classes.sectionTitle}>
          4. Essential vs. non-essential cookies
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          The browser storage used for sign-in and security, including localStorage-backed auth
          tokens and short-lived OAuth security cookies, is required for key account features to
          work correctly.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn does not currently deploy analytics, advertising, or cross-site tracking cookies
          in the live app. The cookie notice may let you record a future preference about optional
          analytics tools, but that preference is stored locally only and does not enable tracking
          today. If we add optional cookies in the future, we will update this policy and, where
          required, ask for your consent before enabling them.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          5. How to manage cookies
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          You can control cookies through your browser settings (for example, blocking or deleting
          cookies) and clear site data (including localStorage) for TurtleIn in your browser. Doing
          so may sign you out, remove recent searches stored on that device, reset your cookie-notice
          response, or interrupt Google/GitHub sign-in flows.
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
