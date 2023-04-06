import React, { FC, useEffect, useRef, useState } from "react";
import { Document } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { usePinch } from "@use-gesture/react";
import { FixedSizeList as List } from "react-window";
import { PageItem } from "./PageItem";
import { roundToOneDigit } from "../../utils";
import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "./constants";
import "./content.css";

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
    document.addEventListener("touchstart", handleTouchPreventDefault, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchPreventDefault, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchPreventDefault, {
      passive: false,
    });
    document.addEventListener("wheel", (e) => e.preventDefault(), {
      passive: false,
    });
  }, []);

  const onDocumentLoadSuccess = (pdfObject: PDFDocumentProxy) => {
    setTotalPages(pdfObject.numPages);
    calculateInitialPageScale(pdfObject);
  };

  const calculateInitialPageScale = async (pdfObject: PDFDocumentProxy) => {
    const firstPage = await pdfObject.getPage(1);
    const firstPageViewport = firstPage.getViewport({ scale: 1 });
    const firstPageWidth = firstPageViewport.width;
    const scalingFactor = documentWidth / firstPageWidth;
    if (scalingFactor < 1) {
      setPageScale(roundToOneDigit(scalingFactor));
    }
  };

  useEffect(() => {
    if (pdfDocumentRef.current) {
      setDocumentHeight(pdfDocumentRef.current.clientHeight);
      const width = (pdfDocumentRef.current.firstChild as HTMLElement)
        .clientWidth;
      setDocumentWidth(width);
    }
  }, []);

  const pinchHandler = usePinch(
    ({ canceled, memo, direction }) => {
      setTimeout(() => {
        if (canceled) return;

        const scale = roundToOneDigit(
          memo
            ? memo + direction[0] * SCALE_STEP
            : pageScale + direction[0] * SCALE_STEP
        );
        setPageScale(Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE));
        return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
      }, 0);
    },
    { pinchOnWheel: true }
  );

  return (
    <Document
      className="content"
      file={pathToFile}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(error) => console.log(`Error: ${error.message}`)}
      inputRef={pdfDocumentRef}
      {...pinchHandler()}
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
        width={"100%"}
        onItemsRendered={({ visibleStartIndex }) => {
          setVisibleStartIndex(visibleStartIndex);
        }}
      >
        {PageItem}
      </List>
    </Document>
  );
};
