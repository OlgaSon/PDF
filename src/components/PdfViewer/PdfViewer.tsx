import React, { FC, useState } from "react";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Header } from "./Header";
import { Content } from "./Content";
import { INITIAL_SCALE } from "./constants";
import styles from "./pdfViewer.module.css";

interface IPdfViewerProps {
  pathToFile: string;
}

export const PdfViewer: FC<IPdfViewerProps> = ({ pathToFile }) => {
  const [pageScale, setPageScale] = useState(INITIAL_SCALE);
  const [renderTime, setRenderTime] = useState(0);

  return (
    <div className={styles.pdfViewer}>
      <Header
        pathToFile={pathToFile}
        pageScale={pageScale}
        setPageScale={setPageScale}
        renderTime={renderTime}
      />
      <Content
        pathToFile={pathToFile}
        pageScale={pageScale}
        setPageScale={setPageScale}
        setRenderTime={setRenderTime}
      />
    </div>
  );
};
