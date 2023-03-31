import React, { useState } from "react";
import { Document, Page, PDFPageProxy } from "react-pdf";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import "./containerMain.css";

export const ContainerMain = ({
  pathToPdf,
  pageScale,
  startTime,
  setLoadingTime,
  loadingTime,
}: {
  pathToPdf: string;
  pageScale: number;
  startTime: number;
  setLoadingTime: (time: number) => void;
  loadingTime: number;
}) => {
  const [totalPages, setTotalPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(window.innerWidth);
  const [pageHeiht, setPageHeiht] = useState(window.innerHeight);

  const onDocumentLoadSuccess = async (pdfObject: PDFDocumentProxy) => {
    setTotalPages(pdfObject.numPages);
  };

  const onPageRenderSuccess = (page: PDFPageProxy) => {
    if (page.pageNumber === 1 && !loadingTime) {
      setLoadingTime(Date.now() - startTime);
    }
    setPageHeiht(page.height);
    setPageWidth(page.width);
  };

  const ListChild = ({ index, style }: ListChildComponentProps) => {
    return (
      <div className="page-container" style={style}>
        <Page
          pageNumber={index + 1}
          scale={pageScale}
          onRenderSuccess={onPageRenderSuccess}
        />
      </div>
    );
  };

  return (
    <Document
      className="document-container"
      file={pathToPdf}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(error) => console.log("Error: " + error.message)}
    >
      <List
        itemCount={totalPages}
        itemSize={pageHeiht}
        height={window.innerHeight - 177}
        width={pageWidth}
      >
        {ListChild}
      </List>
    </Document>
  );
};
