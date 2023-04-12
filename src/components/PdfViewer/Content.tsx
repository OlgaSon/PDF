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
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);
  const [documentWidth, setDocumentWidth] = useState(0);
  const pdfDocumentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchPreventDefault = (e: TouchEvent) => {
      if (e.touches.length === 2) e.preventDefault();
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
    const firstPageViewport = firstPage.getViewport({ scale: INITIAL_SCALE });
    const firstPageWidth = firstPageViewport.width;
    const scalingFactor = roundToDecimal(documentWidth / firstPageWidth);
    if (scalingFactor < 1) {
      setPageScale(scalingFactor);
    }
  };

  useGesture(
    {
      onPinch: ({ active, direction, ...data }) => {
        if (!active) return;
        const deltaX = direction[0];
        const deltaY = direction[1];
        const zoomIn = deltaX > 0 && deltaY > 0;
        const zoomOut = deltaX < 0 && deltaY < 0;
        if (zoomIn || zoomOut) {
          const newScale = calculateNewScale(pageScale, deltaY);
          setPageScale(newScale);
        }
      },
      onWheel: ({ active, ctrlKey, direction, event, ...data }) => {
        if (active && ctrlKey) {
          event.preventDefault();
          const deltaY = -direction[1];
          const newScale = calculateNewScale(pageScale, deltaY);
          setPageScale(newScale);
        }
      },
    },
    {
      target: pdfDocumentRef,
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
        inputRef={pdfDocumentRef}
      >
        <List
          itemCount={totalPages}
          itemSize={pageSize}
          itemData={{
            pageScale,
            visibleStartIndex,
            setPageSize,
            setRenderTime,
          }}
          height={documentHeight}
          width="100%"
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
