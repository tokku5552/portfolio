export interface StageAnchor {
  /** Document offset (px) of the section's top edge. */
  top: number;
  stage: number;
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** A section starts taking over when its top reaches this share of the viewport. */
const TRANSITION_START = 0.55;
/** ...and has fully taken over once its top has moved this share further up. */
const TRANSITION_LENGTH = 0.3;

/**
 * Continuous stage value for the current scroll position.
 *
 * Anchors are chain-blended in document order: each one pulls the value
 * toward its stage as its top crosses the upper half of the viewport. Blocks
 * without an anchor and neighbours sharing a stage therefore just hold the
 * previous value. The upper-half window keeps short sections (e.g. Works)
 * from sitting permanently mid-transition.
 */
export function computeStage(
  anchors: StageAnchor[],
  scrollY: number,
  viewportHeight: number
): number {
  if (anchors.length === 0) return 0;
  const sorted = [...anchors].sort((a, b) => a.top - b.top);
  let value = sorted[0].stage;
  for (let i = 1; i < sorted.length; i++) {
    const top = sorted[i].top - scrollY;
    const t = clamp(
      (viewportHeight * TRANSITION_START - top) /
        (viewportHeight * TRANSITION_LENGTH),
      0,
      1
    );
    value += (sorted[i].stage - value) * t;
  }
  return value;
}
