import React, { FC, useEffect, useRef, useState } from "react";
import { Document, pdfjs } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { useGesture } from "@use-gesture/react";
import { FixedSizeList as List } from "react-window";
import { PageItem } from "./PageItem";
import { roundToDecimal } from "../../utils";
import { calculateNewScale } from "./utils/calculateNewScale";
import { INITIAL_SCALE } from "./constants";
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
  const [currentVisiblePageIndex, setCurrentVisiblePageIndex] = useState(0);
  const [documentSize, setDocumentSize] = useState({ height: 0, width: 0 });
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  /* Prevent default touch behavior for two-finger touches 
  so that the pinch gesture is properly handled with the useGesture hook. */
  useEffect(() => {
    const pdf = pdfContainerRef.current;
    if (!pdf) return;

    const handleTouchPreventDefault = (e: TouchEvent) => {
      if (e.touches.length === 2) e.preventDefault();
    };
    pdf.addEventListener("touchstart", handleTouchPreventDefault);
    pdf.addEventListener("touchmove", handleTouchPreventDefault);
    pdf.addEventListener("touchend", handleTouchPreventDefault);

    return () => {
      pdf.removeEventListener("touchstart", handleTouchPreventDefault);
      pdf.removeEventListener("touchmove", handleTouchPreventDefault);
      pdf.removeEventListener("touchend", handleTouchPreventDefault);
    };
  }, [pdfContainerRef]);

  useEffect(() => {
    const pdf = pdfContainerRef.current;
    if (!pdf) return;

    setDocumentSize({
      height: pdf.clientHeight,
      width: pdf.clientWidth,
    });
  }, [pdfContainerRef]);

  const onDocumentLoadSuccess = (pdfObject: PDFDocumentProxy) => {
    setTotalPages(pdfObject.numPages);
    calculateInitialPageScale(pdfObject);
  };

  const calculateInitialPageScale = async (pdfObject: PDFDocumentProxy) => {
    const firstPage = await pdfObject.getPage(1);
    const firstPageViewport = firstPage.getViewport({ scale: INITIAL_SCALE });
    const firstPageWidth = firstPageViewport.width;
    const scalingFactor = roundToDecimal(documentSize.width / firstPageWidth);
    if (scalingFactor < 1) {
      setPageScale(scalingFactor);
    }
  };

  useGesture(
    {
      onPinch: ({ active, direction }) => {
        if (!active) return;
        const deltaX = direction[0];
        const deltaY = direction[1];
        const isZoomIn = deltaX > 0 && deltaY > 0;
        const isZoomOut = deltaX < 0 && deltaY < 0;
        if (isZoomIn || isZoomOut) {
          const newScale = calculateNewScale(pageScale, deltaY);
          setPageScale(newScale);
        }
      },
      onWheel: ({ active, ctrlKey, direction, event }) => {
        if (active && ctrlKey) {
          event.preventDefault();
          const deltaY = -direction[1];
          const newScale = calculateNewScale(pageScale, deltaY);
          setPageScale(newScale);
        }
      },
    },
    {
      target: pdfContainerRef,
      pinch: { pinchOnWheel: false },
      eventOptions: { passive: false },
    }
  );

  return (
    <div className={styles.wrapper}>
      <Document
        className={styles.document}
        file={pathToFile}
        onLoadSuccess={onDocumentLoadSuccess}
        inputRef={pdfContainerRef}
      >
        <List
          itemCount={totalPages}
          itemSize={pageSize}
          itemData={{
            pageScale,
            currentVisiblePageIndex,
            setPageSize,
            setRenderTime,
          }}
          height={documentSize.height}
          width="100%"
          onItemsRendered={({ visibleStartIndex }) => {
            setCurrentVisiblePageIndex(visibleStartIndex);
          }}
        >
          {PageItem}
        </List>
      </Document>
    </div>
  );
};
