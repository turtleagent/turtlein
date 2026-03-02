import React from "react";
import { ChevronDown } from "lucide-react";
import { Hidden } from "@material-ui/core";
import Style from "./Style";

const MenuItem = ({ Icon, title, arrow, onClick }) => {
  const classes = Style();
  return (
    <div className={classes.menuItem} onClick={onClick}>
      {Icon}
      <Hidden mdDown>
        <div className={classes.title}>
          <p>{title}</p>
          {arrow && <ChevronDown size={20} strokeWidth={1.75} />}
        </div>
      </Hidden>
    </div>
  );
};

export default MenuItem;
