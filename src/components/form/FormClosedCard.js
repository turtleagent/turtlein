import React from "react";
import { Avatar, Paper } from "@material-ui/core";
import { ImageIcon, Video, Newspaper } from "lucide-react";
import Styles from "./Style";

const FormClosedCard = ({ user, onStartPost, onPhotoClick, onVideoClick, onWriteArticle }) => {
  const classes = Styles();

  return (
    <Paper className={classes.closedCard}>
      <div className={classes.topRow}>
        <Avatar
          className={classes.avatar}
          src={user?.photoURL}
          alt={user?.displayName}
        />
        <button
          type="button"
          className={classes.startPostButton}
          onClick={onStartPost}
        >
          Start a post
        </button>
      </div>
      <div className={classes.toolbar}>
        <button
          type="button"
          className={classes.toolbarButton}
          onClick={onPhotoClick}
        >
          <ImageIcon size={24} strokeWidth={1.75} style={{ color: "#378FE9" }} />
          <span>Photo</span>
        </button>
        <button
          type="button"
          className={classes.toolbarButton}
          onClick={onVideoClick}
        >
          <Video size={24} strokeWidth={1.75} style={{ color: "#5F9B41" }} />
          <span>Video</span>
        </button>
        <button
          type="button"
          className={classes.toolbarButton}
          onClick={onWriteArticle}
        >
          <Newspaper size={24} strokeWidth={1.75} style={{ color: "#E06847" }} />
          <span>Write article</span>
        </button>
      </div>
    </Paper>
  );
};

export default FormClosedCard;
