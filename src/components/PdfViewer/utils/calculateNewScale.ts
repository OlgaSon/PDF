import { MAX_SCALE, MIN_SCALE, SCALE_STEP } from "../constants";
import { roundToDecimal } from "../../../utils";

export const calculateNewScale = (
  prevScale: number,
  direction: number
): number => {
  const scaleUnit = direction * SCALE_STEP;
  const newScale = roundToDecimal(prevScale + scaleUnit);
  const boundedScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
  return boundedScale;
};
