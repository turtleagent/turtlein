import React from "react";
import { useQuery } from "convex/react";
import { Paper, Avatar } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Tag, Bookmark, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../convex/_generated/api";
import useConvexUser from "../../../hooks/useConvexUser";
import Style from "./Style";

const SidebarTop = () => {
  const classes = Style();
  const theme = useTheme();
  const user = useConvexUser();
  const connectionCount = useQuery(
    api.connections.getConnectionCount,
    user?._id ? { userId: user._id } : "skip",
  );
  const connections = connectionCount ?? 0;

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.profileCard}>
        <div
          className={classes.cover}
          style={{
            backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        />
        <div className={classes.profileBody}>
          <Avatar src={user?.photoURL} className={classes.avatar} />
          <h4 className={classes.displayName}>{user?.displayName ?? "Guest User"}</h4>
          <p className={classes.subtitle}>{user?.title ?? "TurtleIn member"}</p>
        </div>
      </Paper>

      <Paper className={classes.statsCard}>
        <div className={classes.stat}>
          <h4>Connections</h4>
          <p>{connections}</p>
        </div>
      </Paper>

      <Paper className={classes.actionsCard}>
        <div className={classes.actionItem}>
          <Tag size={20} strokeWidth={1.75} style={{ transform: "rotate(-90deg)" }} />
          <h4>My Items</h4>
        </div>
        <Link to="/saved" className={classes.actionLink}>
          <div className={classes.actionItem}>
            <Bookmark size={20} strokeWidth={1.75} />
            <h4>Saved posts</h4>
          </div>
        </Link>
        <Link to="/create-company" className={classes.actionLink}>
          <div className={classes.actionItem}>
            <Building2 size={20} strokeWidth={1.75} />
            <h4>Create company</h4>
          </div>
        </Link>
      </Paper>
    </div>
  );
};

export default SidebarTop;
