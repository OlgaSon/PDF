import React from "react";
import { ZoomIn, ZoomOut } from "../assets";
import "./containerHeader.css";

export const ContainerHeader = ({
  pageScale,
  setPageScale,
  pathToPdf,
  loadingTime,
}: {
  pageScale: number;
  setPageScale: (pageScale: number) => void;
  pathToPdf: string;
  loadingTime: number;
}) => {
  const handleZoomIn = () => setPageScale(pageScale + 0.2);
  const handleZoomOut = () => setPageScale(pageScale - 0.2);

  return (
    <header className="header">
      <div className="service-info">
        <div className="service-block">
          <p>LOADED URL</p>
          <div className="file-path">{pathToPdf}</div>
        </div>
        <div className="service-block">
          <p>RENDER TIME</p>
          <div className="load-time">{loadingTime} ms</div>
        </div>
      </div>
      <div className="button-container">
        <button onClick={handleZoomIn} disabled={pageScale >= 3}>
          <ZoomIn />
        </button>
        <button onClick={handleZoomOut} disabled={pageScale <= 0.3}>
          <ZoomOut />
        </button>
      </div>
    </header>
  );
};
