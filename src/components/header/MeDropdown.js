import React, { useCallback, useState } from "react";
import {
  Avatar,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import { Moon, Sun, Trash2 } from "lucide-react";

const useStyles = makeStyles((theme) => ({
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    right: 0,
    width: 280,
    zIndex: 1000,
    borderRadius: 8,
    padding: "4px 0",
    backgroundColor: theme.palette.background.paper,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 16px 12px",
  },
  avatar: {
    width: 56,
    height: 56,
    flexShrink: 0,
  },
  userInfo: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userTitle: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  profileButtonRow: {
    padding: "0 16px 12px",
  },
  profileButton: {
    textTransform: "none",
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 999,
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    borderWidth: "1.5px",
    padding: "2px 16px",
    "&:hover": {
      borderWidth: "1.5px",
      borderColor: theme.palette.primary.dark,
      backgroundColor: fade(theme.palette.primary.main, 0.07),
    },
  },
  divider: {
    height: 1,
    backgroundColor: theme.palette.divider,
    margin: "4px 0",
  },
  sectionHeader: {
    padding: "8px 16px 4px",
    fontSize: 12,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: 14,
    color: theme.palette.text.primary,
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  rowLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: theme.palette.text.primary,
    "& > svg": {
      color: theme.palette.text.secondary,
    },
  },
  rowValue: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
  dangerRow: {
    color: theme.palette.error.main,
  },
  dangerIcon: {
    color: theme.palette.error.main,
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  dialogBody: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    lineHeight: 1.5,
  },
  errorText: {
    marginTop: 12,
    color: theme.palette.error.main,
    fontSize: 13,
    fontWeight: 500,
  },
}));

const MeDropdown = ({
  open,
  user,
  isDarkMode,
  onToggleTheme,
  onViewProfile,
  onSignOut,
  onDeleteAccount,
  onClose,
}) => {
  const classes = useStyles();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleClickAway = useCallback(() => {
    if (isDeleteDialogOpen) {
      return;
    }
    onClose();
  }, [isDeleteDialogOpen, onClose]);

  const handleConfirmDelete = useCallback(async () => {
    if (!onDeleteAccount) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await onDeleteAccount();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      setDeleteError(error?.message || "Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [onDeleteAccount]);

  if (!open && !isDeleteDialogOpen) {
    return null;
  }

  return (
    <>
      {open ? (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper className={classes.dropdown} elevation={3}>
            <div className={classes.userCard}>
              <Avatar src={user?.photoURL} alt={user?.displayName} className={classes.avatar} />
              <div className={classes.userInfo}>
                <Typography className={classes.userName}>
                  {user?.displayName || "TurtleIn User"}
                </Typography>
                <Typography className={classes.userTitle}>
                  {user?.title || "TurtleIn Member"}
                </Typography>
              </div>
            </div>

            <div className={classes.profileButtonRow}>
              <Button
                variant="outlined"
                fullWidth
                className={classes.profileButton}
                onClick={onViewProfile}
              >
                View profile
              </Button>
            </div>

            <div className={classes.divider} />

            <Typography className={classes.sectionHeader}>Account</Typography>

            <div
              className={classes.row}
              onClick={onToggleTheme}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggleTheme();
                }
              }}
            >
              <div className={classes.rowLabel}>
                {isDarkMode ? (
                  <Moon size={18} strokeWidth={1.75} />
                ) : (
                  <Sun size={18} strokeWidth={1.75} />
                )}
                <span>Appearance</span>
              </div>
              <span className={classes.rowValue}>{isDarkMode ? "Dark" : "Light"}</span>
            </div>

            <div className={classes.divider} />

            <div
              className={`${classes.row} ${classes.dangerRow}`}
              onClick={() => {
                if (!onDeleteAccount || isDeleting) {
                  return;
                }
                setIsDeleteDialogOpen(true);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!onDeleteAccount || isDeleting) {
                    return;
                  }
                  setIsDeleteDialogOpen(true);
                }
              }}
            >
              <div className={classes.rowLabel}>
                <Trash2 size={18} strokeWidth={1.75} className={classes.dangerIcon} />
                <span>Delete account</span>
              </div>
            </div>

            <div className={classes.divider} />

            <div
              className={classes.row}
              onClick={onSignOut}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSignOut();
                }
              }}
            >
              <span>Sign Out</span>
            </div>
          </Paper>
        </ClickAwayListener>
      ) : null}

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          if (isDeleting) {
            return;
          }
          setIsDeleteDialogOpen(false);
          setDeleteError("");
        }}
        aria-labelledby="delete-account-dialog-title"
      >
        <DialogTitle id="delete-account-dialog-title">Delete your account?</DialogTitle>
        <DialogContent dividers>
          <Typography className={classes.dialogBody}>
            This permanently deletes your TurtleIn profile and data (posts, comments, likes,
            connections, messages, follows, bookmarks, reports, and more). This action cannot be
            undone.
          </Typography>
          {deleteError ? <div className={classes.errorText}>{deleteError}</div> : null}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (isDeleting) {
                return;
              }
              setIsDeleteDialogOpen(false);
              setDeleteError("");
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="contained"
            className={classes.deleteButton}
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MeDropdown;
