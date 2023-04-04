import React, { FC } from "react";
import { ZoomIn, ZoomOut } from "../../assets";
import "./header.css";
import { timeToString } from "../../utils/timeToString";

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
  const handleZoomIn = () => setPageScale((prevScale) => prevScale + 0.1);
  const handleZoomOut = () => setPageScale((prevScale) => prevScale - 0.1);

  return (
    <header className="header">
      <div className="loading-info">
        <div>LOADED URL</div>
        <div>RENDER TIME</div>
        <div className="file-path">{pathToFile}</div>
        <div className="render-duration">{timeToString(renderTime)}</div>
      </div>
      <div className="zoom-controls">
        <button onClick={handleZoomIn} disabled={pageScale >= 5}>
          <ZoomIn />
        </button>
        <button onClick={handleZoomOut} disabled={pageScale < 0.2}>
          <ZoomOut />
        </button>
      </div>
    </header>
  );
};
