import { computeStage } from './stage';

const VH = 1000;

describe('computeStage', () => {
  const anchors = [
    { top: 0, stage: 0 },
    { top: 2000, stage: 1 },
    { top: 3000, stage: 1 },
    { top: 4000, stage: 2 },
  ];

  it('returns 0 when there are no anchors', () => {
    expect(computeStage([], 500, VH)).toBe(0);
  });

  it('holds the first stage until the next section reaches the upper half', () => {
    // Next anchor top sits at 0.55vh: transition has not started yet.
    expect(computeStage(anchors, 2000 - 550, VH)).toBe(0);
  });

  it('blends across the transition window and completes 0.3vh later', () => {
    expect(computeStage(anchors, 2000 - 400, VH)).toBeCloseTo(0.5);
    expect(computeStage(anchors, 2000 - 250, VH)).toBe(1);
  });

  it('holds while neighbouring sections share a stage', () => {
    expect(computeStage(anchors, 3000, VH)).toBe(1);
    expect(computeStage(anchors, 3400, VH)).toBe(1);
  });

  it('holds the previous stage across blocks without an anchor', () => {
    // Between anchors (e.g. HeroStrip) nothing new takes over.
    expect(computeStage(anchors, 1000, VH)).toBe(0);
  });

  it('reaches the last stage once its section has taken over', () => {
    expect(computeStage(anchors, 4000, VH)).toBe(2);
  });

  it('does not depend on anchor order', () => {
    const shuffled = [anchors[2], anchors[0], anchors[3], anchors[1]];
    expect(computeStage(shuffled, 2000 - 400, VH)).toBeCloseTo(0.5);
  });
});
