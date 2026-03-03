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

const TermsOfService = () => {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <Paper elevation={0} className={classes.card}>
        <Typography variant="h4" className={classes.title} gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body2" className={classes.subtitle}>
          Effective date: March 3, 2026
        </Typography>
        <Typography variant="body2" className={classes.finePrint}>
          TurtleIn is a demo LinkedIn-style social networking app. These Terms are provided for
          informational purposes and are not legal advice.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          1. Acceptance of these Terms
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          By accessing or using TurtleIn ("TurtleIn", "we", "us"), you agree to be bound by these
          Terms of Service (the "Terms"). If you do not agree, do not use the service.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          2. Eligibility and accounts
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          You are responsible for your account activity and for keeping your login credentials
          secure. You must provide accurate information and keep your profile reasonably up to date.
          We may suspend or terminate accounts that violate these Terms or applicable law.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          3. Your content and license
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          You own the content you submit to TurtleIn (such as profile information, posts, comments,
          images, messages, and other materials) ("User Content"). You grant TurtleIn a worldwide,
          non-exclusive, royalty-free license to host, store, reproduce, modify (for formatting),
          display, and distribute your User Content solely for operating, improving, and promoting
          the service and as permitted by your privacy and visibility settings.
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          You represent that you have the rights necessary to submit User Content and that your User
          Content does not violate law or the rights of others.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          4. Prohibited conduct
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          You agree not to misuse TurtleIn. Prohibited conduct includes:
        </Typography>
        <ul className={classes.bulletList}>
          <li className={classes.bulletItem}>
            Posting illegal, harmful, harassing, hateful, or deceptive content.
          </li>
          <li className={classes.bulletItem}>
            Impersonating others, misrepresenting your identity, or attempting to access accounts
            you do not own.
          </li>
          <li className={classes.bulletItem}>
            Spamming, scraping, automated account creation, or otherwise interfering with the
            service’s normal operation.
          </li>
          <li className={classes.bulletItem}>
            Uploading malware or attempting to disrupt, damage, or gain unauthorized access to our
            systems.
          </li>
          <li className={classes.bulletItem}>
            Violating the privacy or intellectual property rights of others.
          </li>
        </ul>

        <Typography variant="h6" className={classes.sectionTitle}>
          5. Service changes and availability
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn may change, suspend, or discontinue parts of the service at any time. We do not
          guarantee that the service will always be available, secure, or error-free.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          6. Termination
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          You may stop using TurtleIn at any time. We may suspend or terminate your access if we
          reasonably believe you have violated these Terms, created risk for us or other users, or
          where required by law. Termination may result in loss of access to User Content; however,
          we may retain certain data for security, fraud prevention, and legal compliance where
          applicable.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          7. Disclaimer of warranties
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          TurtleIn is provided "as is" and "as available" without warranties of any kind, express or
          implied, including warranties of merchantability, fitness for a particular purpose, and
          non-infringement, to the fullest extent permitted by law.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          8. Limitation of liability
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          To the fullest extent permitted by law, TurtleIn and its operators will not be liable for
          any indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, revenues, data, or goodwill, arising out of or related to your use of the service.
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          9. Governing law
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          These Terms are governed by the laws of the jurisdiction where TurtleIn is operated, without
          regard to conflict of law principles. (This demo does not specify a jurisdiction.)
        </Typography>

        <Typography variant="h6" className={classes.sectionTitle}>
          10. Contact
        </Typography>
        <Typography variant="body1" className={classes.paragraph}>
          For questions about these Terms, contact us at{" "}
          <a href="mailto:legal@turtlein.example">legal@turtlein.example</a>.
        </Typography>
      </Paper>
    </div>
  );
};

export default TermsOfService;

