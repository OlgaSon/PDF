import { useWheel } from "@use-gesture/react";
import React, { FC, memo, useEffect, useRef } from "react";
import { PDFPageProxy, Page } from "react-pdf";
import { ListChildComponentProps } from "react-window";
import { calculateNewScale } from "./calculateNewScale";

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

    useEffect(() => {
      const page = pageRef.current;
      if (page)
        page.addEventListener("wheel", (e: WheelEvent) => e.preventDefault());
    }, [pageRef]);

    const onPageRenderSuccess = (page: PDFPageProxy) => {
      if (page.pageNumber === 1) {
        const renderDuration = Math.round(
          performance.now() - startTime.current
        );
        setRenderTime(renderDuration);
      }
      setPageSize(page.height);
    };

    /* Adding gutter between pages */
    const _style = {
      ...style,
      top: ((style?.top as number) || 0) + (index - visibleStartIndex) * GUTTER,
      maxWidth: "100%",
      width: "max-content",
      left: "auto",
      right: "auto",
    };

    useWheel(
      ({ memo, direction }) => {
        const deltaY = -direction[1];
        calculateNewScale(memo, deltaY, pageScale, setPageScale);
      },
      { eventOptions: { passive: false }, target: pageRef }
    );

    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={_style} ref={pageRef}>
          <Page
            pageNumber={index + 1}
            scale={pageScale}
            onRenderSuccess={onPageRenderSuccess}
          />
        </div>
      </div>
    );
  }
);
