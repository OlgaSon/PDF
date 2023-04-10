import React, { FC, useEffect, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { usePinch } from "@use-gesture/react";
import { FixedSizeList as List } from "react-window";
import { PageItem } from "./PageItem";
import { roundToDecimal } from "../../utils";
import { calculateNewScale } from "./calculateNewScale";
import styles from "./content.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface IContentProps {
  pathToFile: string;
  pageScale: number;
  setPageScale: React.Dispatch<React.SetStateAction<number>>;
  setRenderTime: React.Dispatch<React.SetStateAction<number>>;
}

export const Content: FC<IContentProps> = ({
  pathToFile,
  pageScale,
  setPageScale,
  setRenderTime,
}) => {
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(window.innerHeight);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [documentWidth, setDocumentWidth] = useState(0);
  const pdfDocumentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchPreventDefault = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
      }
    };
    const pdf = pdfDocumentRef.current;
    if (pdf) {
      pdf.addEventListener("touchstart", handleTouchPreventDefault);
      pdf.addEventListener("touchmove", handleTouchPreventDefault);
      pdf.addEventListener("touchend", handleTouchPreventDefault);
    }
  }, []);

  useEffect(() => {
    if (pdfDocumentRef.current) {
      setDocumentHeight(pdfDocumentRef.current.clientHeight);
      setDocumentWidth(pdfDocumentRef.current.clientWidth);
    }
  }, [pdfDocumentRef]);

  const onDocumentLoadSuccess = (pdfObject: PDFDocumentProxy) => {
    setTotalPages(pdfObject.numPages);
    calculateInitialPageScale(pdfObject);
  };

  const calculateInitialPageScale = async (pdfObject: PDFDocumentProxy) => {
    const firstPage = await pdfObject.getPage(1);
    const firstPageViewport = firstPage.getViewport({ scale: 1 });
    const firstPageWidth = firstPageViewport.width;
    const scalingFactor = roundToDecimal(documentWidth / firstPageWidth);
    if (scalingFactor < 1) {
      setPageScale(scalingFactor);
    }
  };

  usePinch(
    ({ active, memo, direction }) => {
      if (!active) return;
      const deltaX = direction[0];
      const deltaY = direction[1];
      const zoomIn = deltaX > 0 && deltaY > 0;
      const zoomOut = deltaX < 0 && deltaY < 0;
      if (zoomIn || zoomOut) {
        calculateNewScale(memo, deltaY, pageScale, setPageScale);
      }
    },
    {
      pinchOnWheel: false,
      target: pdfDocumentRef,
      eventOptions: { passive: false },
    }
  );

  return (
    <div className={styles.wrapper}>
      <Document
        className={styles.document}
        file={pathToFile}
        onLoadSuccess={onDocumentLoadSuccess}
        /*  */
        onLoadError={(error) => console.log(`Error: ${error.message}`)}
        /*  */
        inputRef={pdfDocumentRef}
      >
        <List
          itemCount={totalPages}
          itemSize={pageSize}
          itemData={{
            pageScale,
            visibleStartIndex,
            setPageScale,
            setPageSize,
            setRenderTime,
          }}
          height={documentHeight}
          width={"100%"}
          onItemsRendered={({ visibleStartIndex }) => {
            setVisibleStartIndex(visibleStartIndex);
          }}
        >
          {PageItem}
        </List>
      </Document>
    </div>
  );
};
