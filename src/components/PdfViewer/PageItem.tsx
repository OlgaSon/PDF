import React, { FC, memo, useEffect, useRef } from "react";
import { PDFPageProxy, Page } from "react-pdf";
import { ListChildComponentProps } from "react-window";
import { useWheel } from "@use-gesture/react";
import { calculateNewScale } from "./calculateNewScale";
import styles from "./pageItem.module.css";

const GUTTER = 10;

interface IPageItemProps extends ListChildComponentProps {
  data: {
    pageScale: number;
    visibleStartIndex: number;
    setPageScale: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    setRenderTime: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const PageItem: FC<IPageItemProps> = memo(
  ({
    index,
    style,
    data: {
      pageScale,
      visibleStartIndex,
      setPageScale,
      setPageSize,
      setRenderTime,
    },
  }) => {
    const startTime = useRef(0);
    const pageRef = useRef<HTMLDivElement>(null);

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
      maxWidth: "100%",
      width: "max-content",
      left: "auto",
      right: "auto",
    };

    useWheel(
      ({ ctrlKey, direction, event, memo }) => {
        if (ctrlKey) {
          event.preventDefault();
          const deltaY = -direction[1];
          calculateNewScale(memo, deltaY, pageScale, setPageScale);
        }
      },
      { eventOptions: { passive: false }, target: pageRef }
    );

    return (
      <div className={styles.wrapper}>
        <div style={_style} ref={pageRef}>
          <Page
            className={styles.page}
            pageNumber={index + 1}
            scale={pageScale}
            onRenderSuccess={onPageRenderSuccess}
          />
        </div>
      </div>
    );
  }
);
