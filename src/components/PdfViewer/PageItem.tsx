import React, { FC, memo, useEffect, useRef } from "react";
import { PDFPageProxy, Page } from "react-pdf";
import { ListChildComponentProps } from "react-window";
import styles from "./pageItem.module.css";

const GUTTER = 10;

interface IPageItemProps extends ListChildComponentProps {
  data: {
    pageScale: number;
    visibleStartIndex: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    setRenderTime: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const PageItem: FC<IPageItemProps> = memo(
  ({
    index,
    style,
    data: { pageScale, visibleStartIndex, setPageSize, setRenderTime },
  }) => {
    const startTime = useRef(0);

    useEffect(() => {
      if (index === 0) {
        startTime.current = performance.now();
      }
    }, [index, pageScale]);

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
      top: ((style?.top as number) || 0) + (index - visibleStartIndex) * GUTTER,
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
