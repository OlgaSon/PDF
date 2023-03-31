import React, { ReactElement, useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./container.css";
import { ContainerHeader } from "./ContainerHeader";
import { ContainerMain } from "./ContainerMain";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const Container = ({
  pathToPdf,
}: {
  pathToPdf: string;
}): ReactElement => {
  const [pageScale, setPageScale] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  return (
    <div className="container">
      <ContainerHeader
        pathToPdf={pathToPdf}
        pageScale={pageScale}
        setPageScale={setPageScale}
        loadingTime={loadingTime}
      />
      <ContainerMain
        pathToPdf={pathToPdf}
        pageScale={pageScale}
        startTime={startTime}
        loadingTime={loadingTime}
        setLoadingTime={setLoadingTime}
      />
    </div>
  );
};
