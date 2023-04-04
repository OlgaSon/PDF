import React, { ReactElement, useEffect, useRef, useState } from "react";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdfViewer.css";
import { PdfViewerHeader } from "./PdfViewerHeader";
import { PdfViewerContent } from "./PdfViewerContent";

interface IPdfViewerProps {
  pathToPdf: string;
}

export const PdfViewer = ({ pathToPdf }: IPdfViewerProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [pageScale, setPageScale] = useState(1);
  const [renderTime, setRenderTime] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.clientHeight);
    }
  }, []);

  return (
    <div className="pdfViewer">
      <div ref={ref}>
        <PdfViewerHeader
          pathToPdf={pathToPdf}
          pageScale={pageScale}
          setPageScale={setPageScale}
          renderTime={renderTime}
        />
      </div>
      <PdfViewerContent
        pathToPdf={pathToPdf}
        pageScale={pageScale}
        headerHeight={headerHeight}
        setPageScale={setPageScale}
        setRenderTime={setRenderTime}
      />
    </div>
  );
};
