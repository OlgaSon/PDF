import React from "react";
import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "./constants";
import { roundToDecimal } from "../../utils";

export const calculateNewScale = (
  prevValue: number,
  direction: number,
  initialScale: number,
  setNewValue: React.Dispatch<React.SetStateAction<number>>
): number => {
  const scaleUnit = direction * SCALE_STEP;
  const newScale = roundToDecimal(
    prevValue ? prevValue + scaleUnit : initialScale + scaleUnit
  );
  const boundedScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
  setNewValue(boundedScale);
  return boundedScale;
};
