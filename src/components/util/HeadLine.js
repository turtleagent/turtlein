import React, { useState, useEffect } from "react";
import { Circle } from "lucide-react";
import { makeStyles } from "@material-ui/core/styles";
import { darkSecondary } from "../../assets/Colors";

const HeadLine = ({ Icon, title, time, count }) => {
  const Style = makeStyles((theme) => ({
    headLine: {
      display: "flex",
      flexDirection: "column",
      padding: time ? "5px 10px" : "0px 10px",
      cursor: "pointer",
      transition: "all 0.4s ease",
      "&:hover": {
        backgroundColor: theme.palette.type === "dark" ? darkSecondary : "lightgrey",
      },
    },
    top: {
      display: "flex",
      alignItems: "center",
      "& > h3": {
        fontSize: 16,
      },
      "& > h4": {
        marginLeft: 10,
        fontSize: time ? 14 : 13,
        fontWeight: time ? 500 : 400,
        color: !time && "grey",
      },
      "& > svg": {
        width: 18,
        height: 18,
      },
    },
    bottom: {
      display: "flex",
      alignItems: "center",
      marginTop: 5,
      paddingLeft: 22,
      "& > h4": {
        fontSize: 12,
        fontWeight: 400,
        color: "grey",
      },
      "& > svg": {
        width: 6,
        height: 6,
        color: "grey",
        margin: "0 5px",
      },
    },
  }));
  const classes = Style();

  const [days, setDays] = useState(1);
  const [readers, setReaders] = useState(1);

  useEffect(() => {
    setDays(Math.floor(Math.random() * 10));
    setReaders(Math.floor(Math.random() * 1000));
  }, []);

  return (
    <div className={classes.headLine}>
      <div className={classes.top}>
        {Icon}
        <h4>{title}</h4>
      </div>
      <div className={classes.bottom}>
        {time && (
          <>
            <h4>{days}d ago</h4>
            <Circle size={6} fill="grey" strokeWidth={0} />
          </>
        )}
        {count && <h4>{readers} readers</h4>}
      </div>
    </div>
  );
};

export default HeadLine;
