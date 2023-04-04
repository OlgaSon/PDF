import React, { useEffect, useState } from "react";
import { Document } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { FixedSizeList as List } from "react-window";
import "./pdfViewerContent.css";
import { PdfViewerPage } from "./PdfViewerPage";

interface IPdfViewerContentProps {
  pathToPdf: string;
  pageScale: number;
  headerHeight: number;
  setPageScale: React.Dispatch<React.SetStateAction<number>>;
  setRenderTime: React.Dispatch<React.SetStateAction<number>>;
}

export const PdfViewerContent = ({
  pathToPdf,
  pageScale,
  headerHeight,
  setPageScale,
  setRenderTime,
}: IPdfViewerContentProps) => {
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(window.innerHeight);
  const [startTime, setStartTime] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const onDocumentLoadSuccess = async (pdfObject: PDFDocumentProxy) => {
    setTotalPages(pdfObject.numPages);
    const firstPage = await pdfObject.getPage(1);
    const firstPageViewport = firstPage.getViewport({ scale: 1 });
    const firstPageWidth = firstPageViewport.width;
    const scalingFactor = window.innerWidth / firstPageWidth;
    if (scalingFactor < 1) {
      setPageScale(scalingFactor);
    }
  };

  useEffect(() => {
    const renderDuration = Math.round(performance.now() - startTime);
    setRenderTime(renderDuration);
  }, [startTime]);

  return (
    <Document
      className="pdfViewerContent"
      file={pathToPdf}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(error) => console.log(`Error: ${error.message}`)}
    >
      <List
        itemCount={totalPages}
        itemSize={pageSize}
        itemData={{ pageScale, visibleStartIndex, setStartTime, setPageSize }}
        height={window.innerHeight - headerHeight}
        width={"100%"}
        onItemsRendered={({ visibleStartIndex }) => {
          setVisibleStartIndex(visibleStartIndex);
        }}
      >
        {PdfViewerPage}
      </List>
    </Document>
  );
};
