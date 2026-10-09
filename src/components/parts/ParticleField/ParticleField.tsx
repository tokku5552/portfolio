import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/cn';
import { createParticleRenderer } from './renderer';
import { STAGE_COUNT } from './shaders';
import { StageAnchor, clamp, computeStage } from './stage';

type Mode = 'pending' | 'webgl' | 'fallback';

export interface ParticleStage {
  /** `id` of the section element that starts this stage. */
  id: string;
  /** Formation index (see shaders.ts): 0 sphere, 1 wave, 2 grid, 3 rain, 4 ring. */
  stage: number;
}

export interface ParticleFieldProps extends HTMLAttributes<HTMLDivElement> {
  stages: ParticleStage[];
  /** Called with true once WebGL draws, and false if it is lost later. */
  onActiveChange?: (active: boolean) => void;
}

// Particle count and DPR are fixed at mount; the shader re-evaluates the
// narrow layout on resize from the canvas size (see isNarrow in shaders.ts).
const NARROW_BREAKPOINT = 700;

/**
 * Full-viewport WebGL particle background. Place it as the first child of a
 * `relative` wrapper and put the content in a sibling with a higher z-index:
 * it spans the wrapper and keeps a viewport-sized canvas stuck to the top,
 * so the canvas scrolls away with the wrapper's end and never covers what
 * follows (e.g. the footer).
 *
 * As each section in `stages` scrolls into view, the same particles unravel
 * and regroup into that section's formation. Users who prefer reduced motion
 * get still frames that switch formation without animating. Renders nothing
 * when WebGL is unavailable; callers decide what to show instead.
 */
export function ParticleField({
  stages,
  onActiveChange,
  className,
  ...rest
}: ParticleFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('pending');
  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;
  const stagesRef = useRef(stages);
  stagesRef.current = stages;

  useEffect(() => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    const canvas = canvasRef.current;
    const content = wrap?.parentElement;
    if (!wrap || !sticky || !canvas || !content) return;

    // Try WebGL before touching any browser API that jsdom / old browsers lack.
    const narrow = window.innerWidth < NARROW_BREAKPOINT;
    const renderer = createParticleRenderer(canvas, {
      count: narrow ? 6000 : 14000,
      maxDpr: narrow ? 1 : 1.5,
    });
    if (!renderer) {
      setMode('fallback');
      return;
    }

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Document offsets of each stage's section, refreshed on layout changes so
    // the per-frame work is arithmetic only.
    let anchors: StageAnchor[] = [];
    const measure = () => {
      anchors = stagesRef.current.flatMap(({ id, stage }) => {
        const el = document.getElementById(id);
        if (!el) return [];
        const top = el.getBoundingClientRect().top + window.scrollY;
        return [{ top, stage: clamp(stage, 0, STAGE_COUNT - 1) }];
      });
    };
    const targetStage = () =>
      computeStage(anchors, window.scrollY, window.innerHeight);

    measure();
    const start = performance.now();
    let frame = 0;
    let time = 0;
    let lost = false;
    let stage = reduceMotion ? Math.round(targetStage()) : targetStage();

    const tick = (now: number) => {
      time = (now - start) / 1000;
      // Right after mount the browser may still be restoring the scroll
      // position or jumping to a hash; follow it directly instead of flying
      // through every formation in between.
      const ease = time < 0.6 ? 1 : 0.08;
      stage += (targetStage() - stage) * ease;
      renderer.draw(time, stage);
      frame = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (!frame && !reduceMotion && !lost) {
        frame = requestAnimationFrame(tick);
      }
    };
    const stopLoop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Reduced motion: no clock, and the formation switches without a tween.
    const onScroll = () => {
      if (lost) return;
      const next = Math.round(targetStage());
      if (next !== stage) {
        stage = next;
        renderer.draw(0, stage);
      }
    };
    if (reduceMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Resizing clears the drawing buffer, so redraw right away instead of
    // leaving a blank frame until the next tick.
    const onResize = () => {
      if (lost) return;
      renderer.resize();
      measure();
      renderer.draw(time, stage);
    };
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(onResize)
        : null;
    resizeObserver?.observe(sticky);
    resizeObserver?.observe(content);
    // Content above us (e.g. the mobile header menu) can shift every section
    // without changing the content's own size; the body grows when it does.
    resizeObserver?.observe(document.body);

    // No off-screen pause: the content spans the whole page above a short
    // footer, so it never fully leaves the viewport. The browser already
    // pauses requestAnimationFrame in background tabs.
    startLoop();

    // A lost context is not restored (no preventDefault, no
    // webglcontextrestored handler): we drop to the static fallback instead.
    const onContextLost = () => {
      lost = true;
      stopLoop();
      setMode('fallback');
      onActiveChangeRef.current?.(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    renderer.draw(time, stage);
    setMode('webgl');
    onActiveChangeRef.current?.(true);

    return () => {
      stopLoop();
      window.removeEventListener('scroll', onScroll);
      resizeObserver?.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
      {...rest}
    >
      {/* lvh, not dvh: the mobile URL bar would otherwise resize the canvas
          (and clear it) on every scroll. h-screen is the fallback for
          browsers without lvh. */}
      <div ref={stickyRef} className="sticky top-0 h-screen h-lvh">
        {mode !== 'fallback' ? (
          <canvas
            ref={canvasRef}
            className={cn(
              'block h-full w-full transition-opacity duration-1000',
              mode === 'webgl' ? 'opacity-100' : 'opacity-0'
            )}
          />
        ) : null}
      </div>
    </div>
  );
}

export default ParticleField;
