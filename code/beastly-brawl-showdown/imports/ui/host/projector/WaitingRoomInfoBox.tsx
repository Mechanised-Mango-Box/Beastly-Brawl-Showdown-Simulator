import { CodeLink } from "./CodeLink";
import { QRBox } from "./QRBox";
import React from "react";

export const WaitingRoomInfoBox = ({ joinUrl }: { joinUrl: string }) => {
  return (
    <div className="waiting-room-info-box">
      {/* {CodeLink(joinUrl)}

      <QRBox joinUrl={joinUrl} /> */}
      <div className="pin-label">Room Code:</div>
      {CodeLink(joinUrl)}
    </div>
  );
};
