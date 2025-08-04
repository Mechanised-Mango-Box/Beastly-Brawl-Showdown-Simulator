import React from "react";
import { ParticipantBox } from "./ParticipantBox";

export const ParticipantDisplayBox = ({ name }: { name: string }) => {
  const names = name
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  return (
    <div className="participants-display-box">
      <div className="participants-grid">
        {names.length > 0 &&
          names.map((n) => <ParticipantBox key={n} name={n} />)}
      </div>
    </div>
  );
};
