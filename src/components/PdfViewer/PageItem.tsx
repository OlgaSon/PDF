import React, { memo, useEffect, useRef } from "react";
import { PDFPageProxy, Page } from "react-pdf";
import { ListChildComponentProps } from "react-window";
import { PAGES_GUTTER } from "./constants";
import styles from "./pageItem.module.css";

type PageItemPropsType = ListChildComponentProps<{
  pageScale: number;
  currentVisiblePageIndex: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setRenderTime: React.Dispatch<React.SetStateAction<number>>;
}>;

export const PageItem = memo<PageItemPropsType>(
  ({
    index,
    style,
    data: { pageScale, currentVisiblePageIndex, setPageSize, setRenderTime },
  }) => {
    const startTime = useRef(performance.now());

    useEffect(() => {
      if (index === 0) {
        startTime.current = performance.now();
      }
      /* the index prop is unique to each PageItem component and doesn't change within the component */
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageScale]);

    const onPageRenderSuccess = (page: PDFPageProxy) => {
      if (page.pageNumber === 1) {
        const renderDuration = Math.round(
          performance.now() - startTime.current
        );
        setRenderTime(renderDuration);
      }
      setPageSize(page.height);
    };

    const _style = {
      ...style,
      /* Adding gutter between pages */
      top:
        ((style?.top as number) || 0) +
        (index - currentVisiblePageIndex) * PAGES_GUTTER,
    };

    return (
      <div style={_style}>
        <Page
          className={styles.page}
          pageNumber={index + 1}
          scale={pageScale}
          onRenderSuccess={onPageRenderSuccess}
        />
      </div>
    );
  }
);
