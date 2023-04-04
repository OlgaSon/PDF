import React, { FC, memo, useEffect, useState } from "react";
import { PDFPageProxy, Page } from "react-pdf";
import { ListChildComponentProps } from "react-window";

const GUTTER = 10;

export const PageItem: FC<ListChildComponentProps> = memo(
  ({
    index,
    style,
    data: { pageScale, visibleStartIndex, setPageSize, setRenderTime },
  }) => {
    const [startTime, setStartTime] = useState(0);

    useEffect(() => {
      if (index === 0) {
        setStartTime(performance.now());
      }
    }, [index, pageScale]);

    const onPageRenderSuccess = (page: PDFPageProxy) => {
      if (page.pageNumber === 1) {
        const renderDuration = Math.round(performance.now() - startTime);
        setRenderTime(renderDuration);
      }
      setPageSize(page.height);
    };

    /* Adding gutter between pages */
    const _style = {
      ...style,
      top: ((style?.top as number) || 0) + (index - visibleStartIndex) * GUTTER,
    };

    return (
      <div style={_style}>
        <Page
          pageNumber={index + 1}
          scale={pageScale}
          onRenderSuccess={onPageRenderSuccess}
        />
      </div>
    );
  }
);
