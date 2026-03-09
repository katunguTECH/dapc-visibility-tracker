"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function VisibilityGauge({ score }: any) {
  return (
    <div className="w-40 h-40">
      <CircularProgressbar
        value={score}
        text={`${score}%`}
        styles={buildStyles({
          textColor: "#1F2937",
          pathColor: "#2563EB",
          trailColor: "#E5E7EB",
        })}
      />
    </div>
  );
}