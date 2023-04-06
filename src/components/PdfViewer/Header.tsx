import React, { FC } from "react";
import { ZoomIn, ZoomOut } from "../../assets";
import { roundToOneDigit, timeToString } from "../../utils";
import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "./constants";
import "./header.css";

interface IHeaderProps {
  pageScale: number;
  setPageScale: React.Dispatch<React.SetStateAction<number>>;
  pathToFile: string;
  renderTime: number;
}

export const Header: FC<IHeaderProps> = ({
  pageScale,
  setPageScale,
  pathToFile,
  renderTime,
}) => {
  const handleZoomIn = () =>
    setPageScale((prevScale) => roundToOneDigit(prevScale + SCALE_STEP));

  const handleZoomOut = () =>
    setPageScale((prevScale) => roundToOneDigit(prevScale - SCALE_STEP));

  return (
    <header className="header">
      <div className="loading-info">
        <div>LOADED URL</div>
        <div>RENDER TIME</div>
        <div className="file-path">{pathToFile}</div>
        <div className="render-duration">{timeToString(renderTime)}</div>
      </div>
      <div className="zoom-controls">
        <button onClick={handleZoomIn} disabled={pageScale >= MAX_SCALE}>
          <ZoomIn />
        </button>
        <button onClick={handleZoomOut} disabled={pageScale <= MIN_SCALE}>
          <ZoomOut />
        </button>
      </div>
    </header>
  );
};
