import React from "react";
import { Typography, Link as MuiLink } from "@material-ui/core";
import { Link } from "react-router-dom";
import Style from "./Style";

const Footer = () => {
  const classes = Style();

  return (
    <footer className={classes.root} aria-label="Site footer">
      <div className={classes.inner}>
        <nav className={classes.links} aria-label="Legal links">
          <MuiLink component={Link} to="/privacy" className={classes.link}>
            Privacy Policy
          </MuiLink>
          <MuiLink component={Link} to="/terms" className={classes.link}>
            Terms of Service
          </MuiLink>
          <MuiLink component={Link} to="/cookies" className={classes.link}>
            Cookie Policy
          </MuiLink>
        </nav>

        <Typography variant="body2" className={classes.copyright}>
          © 2026 TurtleIn
        </Typography>
      </div>
    </footer>
  );
};

export default Footer;

