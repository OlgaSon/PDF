import React, { FC, useState } from "react";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdfViewer.css";
import { Header } from "./Header";
import { Content } from "./Content";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface IPdfViewerProps {
  pathToFile: string;
}

export const PdfViewer: FC<IPdfViewerProps> = ({ pathToFile }) => {
  const [pageScale, setPageScale] = useState(1);
  const [renderTime, setRenderTime] = useState(0);

  return (
    <div className="pdfViewer">
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
