import React, { useState } from "react";
import { Paper } from "@material-ui/core";
import { Circle, Info, ChevronDown } from "lucide-react";
import HeaderInfo from "../../components/util/HeadLine";
import { LinkedInLightBlue } from "../../assets/Colors";
import CompanySuggestions from "../company/CompanySuggestions";
import Style from "./Style";

const Widgets = () => {
  const classes = Style();
  const [expand, setExpand] = useState(false);

  return (
    <div className={classes.widgets}>
      <Paper className={classes.widgets__top}>
        <div className={classes.heading}>
          <h4>TurtleIn News</h4>
          <Info size={16} strokeWidth={1.75} />
        </div>
        {top_1.map((title, i) => (
          <HeaderInfo
            key={`widgets-top_1_${i}`}
            Icon={
              <Circle
                size={12}
                fill={LinkedInLightBlue}
                strokeWidth={0}
              />
            }
            title={title}
            time={true}
            count={true}
          />
        ))}
        {expand &&
          top_2.map((title, i) => (
            <HeaderInfo
              key={`widgets-top_2_${i}`}
              Icon={<Circle size={12} fill={LinkedInLightBlue} strokeWidth={0} />}
              title={title}
              time={true}
              count={true}
            />
          ))}
        <div className={classes.expand} onClick={() => setExpand(!expand)}>
          <h4>{expand ? "Show less" : "Show more"}</h4>
          <ChevronDown size={20} strokeWidth={1.75} style={{ transform: expand ? "rotate(180deg)" : "", transition: "transform 0.2s ease" }} />
        </div>
      </Paper>
      <div className={classes.widgets__suggestions}>
        <CompanySuggestions />
      </div>
      <div className={classes.widgets__bottom}>
        <Paper className={classes.addBanner}>
          <h4>🐢 TurtleIn Premium</h4>
          <p>Unlock priority visibility and premium networking insights.</p>
        </Paper>
      </div>
    </div>
  );
};

const top_1 = [
  "TurtleIn reaches 1000 users",
  "React 19 brings new hooks",
  "Convex raises Series B",
  "Remote work is here to stay",
  "AI pair programming goes mainstream",
];

const top_2 = [
  "Green tech startups surge in 2026",
  "Open source funding hits record high",
  "TypeScript adoption crosses 80%",
  "Serverless backends: the new default",
];

export default Widgets;
