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

const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <Paper elevation={0} className={classes.card}>
        <Typography variant="h4" className={classes.title} gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          Effective date: March 8, 2026
        </Typography>
        <Typography variant="body2" className={classes.finePrint}>
          TurtleIn is a demo LinkedIn-style social networking app. This Privacy Policy is provided for
          informational purposes and is not legal advice.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          1. Who we are
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn ("TurtleIn", "we", "us") provides a professional networking platform where you can
          create a profile, connect with others, and share content.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          2. Data we collect
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          We collect information you provide directly, information from authentication providers, and
          information generated when you use the service.
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.bulletItem}>
            <strong>Account data (Google or GitHub sign-in):</strong> name, email address, profile
            photo, the sign-in provider you use, account/session records created to keep you signed
            in, and basic verification metadata such as email-verification timestamps.
          </li>
          <li className={classes.bulletItem}>
            <strong>Profile data:</strong> username, display name, title, headline, about/summary,
            experience, education, skills, location, profile and cover images, featured posts,
            connection/follower counts, and other fields you choose to add.
          </li>
          <li className={classes.bulletItem}>
            <strong>Content and activity:</strong> posts, comments, reactions/likes, reposts, saved
            posts/bookmarks, reports, and edit history.
          </li>
          <li className={classes.bulletItem}>
            <strong>Connections and follows:</strong> connection requests, accepted connections,
            following/followers, and related metadata.
          </li>
          <li className={classes.bulletItem}>
            <strong>Messaging:</strong> conversation participants, timestamps, message bodies,
            preview snippets, an encrypted/plaintext flag, and an optional conversation encryption
            key. When optional browser-side encryption is used, we store the encrypted message body
            and the conversation key in backend systems.
          </li>
          <li className={classes.bulletItem}>
            <strong>Notifications:</strong> notification records about likes, comments, follows,
            company follows, connection requests or acceptances, mentions, and messages, including
            related sender/reference IDs, read status, and timestamps.
          </li>
          <li className={classes.bulletItem}>
            <strong>Technical data:</strong> basic log data such as timestamps and diagnostic
            information needed to operate and secure the service.
          </li>
        </ul>

        <Typography variant="h6" className={classes.sectionTitle}>
          3. Why we process your data (purpose and legal bases)
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          We process personal data to provide and improve TurtleIn, including:
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.bulletItem}>
            <strong>Provide the service</strong> (create accounts, show profiles in search and
            discovery, publish posts, deliver messages, and generate notifications).
          </li>
          <li className={classes.bulletItem}>
            <strong>Maintain safety and integrity</strong> (prevent abuse, investigate reports).
          </li>
          <li className={classes.bulletItem}>
            <strong>Operate and improve</strong> (performance, debugging, feature development).
          </li>
        </ul>
        <Typography variant="body1" className={classes.paragraph}>
          We also use profile and network data to support username lookup, search, recommendations,
          and similar discovery features. Messaging and notification data are used to render
          conversation previews, unread counts, and in-app alerts.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Depending on your location, our legal bases may include performance of a contract (providing
          the service), legitimate interests (security and improvement), and consent (where required).
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          4. Where your data is stored and who processes it
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn uses third-party infrastructure to host and process data:
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.bulletItem}>
            <strong>Convex Cloud</strong> for database storage and serverless backend functions.
          </li>
          <li className={classes.bulletItem}>
            <strong>Vercel</strong> for hosting and delivering the web application.
          </li>
          <li className={classes.bulletItem}>
            <strong>Google and GitHub</strong> for authentication when you choose those sign-in
            options.
          </li>
        </ul>

        <Typography variant="h6" className={classes.sectionTitle}>
          5. How long we keep your data
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          We retain personal data for as long as necessary to provide the service while your account
          remains active. If you use the current in-app account deletion flow, the live application
          is designed to immediately delete your user record, authentication/session records, profile
          media, authored posts and articles, comments, reactions, bookmarks, follows/connections,
          conversations, messages, notifications, and most related activity records rather than
          anonymizing them.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          Because this deletion runs as a broad cascade, it can also remove entire message threads
          and engagement or report records attached to content you created. Some company-page
          creator or admin references may remain until additional cleanup tooling is added, so we do
          not promise that every historical internal reference disappears immediately.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          6. Your rights (GDPR-style)
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          If you are in the European Economic Area (EEA), the United Kingdom, or Switzerland, you may
          have rights including:
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.bulletItem}>Access to your personal data</li>
          <li className={classes.bulletItem}>Rectification (correction) of inaccurate data</li>
          <li className={classes.bulletItem}>Erasure (deletion), in certain circumstances</li>
          <li className={classes.bulletItem}>Restriction or objection to processing, in certain circumstances</li>
          <li className={classes.bulletItem}>Data portability, in certain circumstances</li>
          <li className={classes.bulletItem}>Withdrawal of consent, where processing is based on consent</li>
          <li className={classes.bulletItem}>Lodging a complaint with a supervisory authority</li>
        </ul>

        <Typography variant="h6" className={classes.sectionTitle}>
          7. Cookies and similar technologies
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn uses cookies and browser storage for a limited set of purposes: localStorage-backed
          sign-in/session state, short-lived Google or GitHub OAuth security cookies, recent-search
          history saved on your device, and remembering that you acknowledged the cookie notice or
          stored a future analytics preference. We do not currently use analytics or advertising
          cookies in the live app.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          8. Changes to this policy
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          We may update this Privacy Policy from time to time. If we make material changes, we will
          update the effective date and provide notice within the app where appropriate.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          9. Contact
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          For privacy questions, contact us at{" "}
          <a href="mailto:privacy@turtlein.example">privacy@turtlein.example</a>.
        </Typography>
      </Paper>
    </div>
  );
};

export default PrivacyPolicy;
