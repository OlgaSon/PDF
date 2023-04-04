import { memo } from "react";
import { PDFPageProxy, Page } from "react-pdf";
import { ListChildComponentProps } from "react-window";

export const PdfViewerPage = memo(
  ({
    index,
    style,
    data: { pageScale, visibleStartIndex, setStartTime, setPageSize },
  }: ListChildComponentProps) => {
    const onPageLoadSuccess = (page: PDFPageProxy) => {
      if (page.pageNumber === 1) {
        setStartTime(performance.now());
      }
    };

    const onPageRenderSuccess = (page: PDFPageProxy) => {
      setPageSize(page.height);
    };

    const gutter = 10;
    const _style = {
      ...style,
      top: ((style?.top as number) || 0) + (index - visibleStartIndex) * gutter,
    };

    return (
      <div style={_style}>
        <Page
          pageNumber={index + 1}
          scale={pageScale}
          onRenderSuccess={onPageRenderSuccess}
          onLoadSuccess={onPageLoadSuccess}
        />
      </div>
    );
  }
);
