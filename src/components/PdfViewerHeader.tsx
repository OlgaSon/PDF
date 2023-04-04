import React from "react";
import { ZoomIn, ZoomOut } from "../assets";
import "./pdfViewerHeader.css";

interface IPdfViewerHeaderProps {
  pageScale: number;
  setPageScale: React.Dispatch<React.SetStateAction<number>>;
  pathToPdf: string;
  renderTime: number;
}

export const PdfViewerHeader = ({
  pageScale,
  setPageScale,
  pathToPdf,
  renderTime,
}: IPdfViewerHeaderProps) => {
  const handleZoomIn = () => setPageScale((prevScale) => prevScale + 0.2);
  const handleZoomOut = () => setPageScale((prevScale) => prevScale - 0.2);

  return (
    <header className="pdfViewerHeader">
      <div className="loading-info">
        <div>LOADED URL</div>
        <div>RENDER TIME</div>
        <div className="pdf-path">{pathToPdf}</div>
        <div className="render-duration">{renderTime} ms</div>
      </div>
      <div className="zoom-controls">
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
