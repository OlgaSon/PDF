import React, { FC } from "react";
import { ZoomIn, ZoomOut } from "../../assets";
import { roundToDecimal, timeToString } from "../../utils";
import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "./constants";
import styles from "./header.module.css";

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
    setPageScale((prevScale) => roundToDecimal(prevScale + SCALE_STEP));

  const handleZoomOut = () =>
    setPageScale((prevScale) => roundToDecimal(prevScale - SCALE_STEP));

  return (
    <header className={styles.header}>
      <div className={styles.loadingInfo}>
        <div>LOADED URL</div>
        <div>RENDER TIME</div>
        <div className={styles.filePath}>{pathToFile}</div>
        <div className={styles.renderDuration}>{timeToString(renderTime)}</div>
      </div>
      <div className={styles.zoomControls}>
        <button onClick={handleZoomOut} disabled={pageScale <= MIN_SCALE}>
          <ZoomOut />
        </button>
        <button onClick={handleZoomIn} disabled={pageScale >= MAX_SCALE}>
          <ZoomIn />
        </button>
      </div>
    </header>
  );
};
