import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Link as MuiLink,
  Paper,
  Switch,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const CONSENT_KEY = "turtlein_cookie_consent";
const PREFS_KEY = "turtlein_cookie_preferences";

const getStoredConsent = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
};

const getStoredPreferences = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(PREFS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveConsent = (value) => {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage unavailable
  }
};

const savePreferences = (prefs) => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage unavailable
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    left: theme.spacing(2),
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    zIndex: theme.zIndex.snackbar,
    pointerEvents: "none",
  },
  card: {
    pointerEvents: "auto",
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
    borderRadius: 12,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    boxShadow:
      theme.palette.type === "dark"
        ? "0 12px 40px rgba(0,0,0,0.55)"
        : "0 12px 40px rgba(0,0,0,0.18)",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    "@media (max-width:767px)": {
      flexDirection: "column",
    },
  },
  title: {
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
  body: {
    marginTop: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    lineHeight: 1.55,
  },
  actions: {
    display: "flex",
    gap: theme.spacing(1),
    flexShrink: 0,
    "@media (max-width:767px)": {
      width: "100%",
      justifyContent: "flex-end",
    },
  },
  manageLink: {
    textDecoration: "underline",
  },
  dialogText: {
    color: theme.palette.text.primary,
    lineHeight: 1.65,
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    fontWeight: 800,
    color: theme.palette.text.primary,
  },
}));

const CookieConsent = () => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const initialPrefs = useMemo(() => {
    const stored = getStoredPreferences();
    return (
      stored ?? {
        functional: true,
        analytics: false,
      }
    );
  }, []);

  const [prefs, setPrefs] = useState(initialPrefs);

  useEffect(() => {
    const stored = getStoredConsent();
    setIsVisible(!stored);
  }, []);

  const handleAccept = () => {
    saveConsent("acknowledged");
    savePreferences({ functional: true, analytics: false });
    setIsVisible(false);
    setIsManageOpen(false);
  };

  const handleOpenManage = () => {
    setIsManageOpen(true);
  };

  const handleCloseManage = () => {
    setIsManageOpen(false);
  };

  const handleSavePreferences = () => {
    saveConsent("managed");
    savePreferences({ ...prefs, functional: true });
    setIsVisible(false);
    setIsManageOpen(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className={classes.root} role="region" aria-label="Cookie consent">
        <Paper elevation={0} className={classes.card}>
          <div className={classes.row}>
            <div>
              <Typography variant="subtitle1" className={classes.title}>
                Cookies and browser storage
              </Typography>
              <Typography variant="body2" className={classes.body}>
                TurtleIn uses essential cookies and local storage for sign-in and security, stores
                recent searches on this device, and remembers whether you dismissed this notice. We
                do not currently use analytics or advertising cookies.{" "}
                <MuiLink component={Link} to="/cookies" className={classes.manageLink}>
                  Learn more
                </MuiLink>
                .
              </Typography>
            </div>

            <div className={classes.actions}>
              <Button variant="outlined" color="primary" onClick={handleOpenManage}>
                Manage
              </Button>
              <Button variant="contained" color="primary" onClick={handleAccept}>
                Acknowledge
              </Button>
            </div>
          </div>
        </Paper>
      </div>

      <Dialog open={isManageOpen} onClose={handleCloseManage} fullWidth maxWidth="sm">
        <DialogTitle>Cookies and browser storage</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" className={classes.dialogText}>
            TurtleIn currently uses essential browser storage for authentication, sign-in security
            checks, recent searches, and remembering this notice. We do not currently place
            analytics or advertising cookies.
          </Typography>

          <Typography variant="subtitle2" className={classes.sectionTitle}>
            Current categories
          </Typography>
          <Box mt={1}>
            <FormControlLabel
              control={<Switch checked disabled color="primary" />}
              label="Essential sign-in and security storage (required)"
            />
            <Typography variant="caption" color="textSecondary">
              Includes auth tokens in localStorage and short-lived Google/GitHub OAuth security
              cookies.
            </Typography>
          </Box>
          <Divider />
          <Box mt={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(prefs.analytics)}
                  onChange={(e) =>
                    setPrefs((prev) => ({
                      ...prev,
                      analytics: e.target.checked,
                    }))
                  }
                  color="primary"
                />
              }
              label="Future analytics preference (not active today)"
            />
            <Typography variant="caption" color="textSecondary">
              Toggling this stores only your preference locally. TurtleIn does not currently place
              analytics cookies or enable analytics tracking based on this setting.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseManage}>Close</Button>
          <Button onClick={handleSavePreferences} color="primary" variant="contained">
            Save preference
          </Button>
          <Button onClick={handleAccept} color="primary" variant="outlined">
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookieConsent;
