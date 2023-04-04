import React, { FC, useEffect, useRef, useState } from "react";
import { Document } from "react-pdf";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { FixedSizeList as List } from "react-window";
import "./content.css";
import { PageItem } from "./PageItem";

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
      setPageScale(scalingFactor);
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

  return (
    <Document
      className="content"
      file={pathToFile}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(error) => console.log(`Error: ${error.message}`)}
      inputRef={pdfDocumentRef}
    >
      <List
        itemCount={totalPages}
        itemSize={pageSize}
        itemData={{ pageScale, visibleStartIndex, setPageSize, setRenderTime }}
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
