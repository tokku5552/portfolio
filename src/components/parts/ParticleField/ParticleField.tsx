import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/cn';
import { createParticleRenderer } from './renderer';
import { STAGE_COUNT } from './shaders';

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

const NARROW_BREAKPOINT = 700;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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
    let anchors: { top: number; stage: number }[] = [];
    const measure = () => {
      anchors = stagesRef.current
        .flatMap(({ id, stage }) => {
          const el = document.getElementById(id);
          if (!el) return [];
          const top = el.getBoundingClientRect().top + window.scrollY;
          return [{ top, stage: clamp(stage, 0, STAGE_COUNT - 1) }];
        })
        .sort((a, b) => a.top - b.top);
    };

    // Chain-blend toward each section as its top crosses the upper half of the
    // viewport (short sections like Works would otherwise always sit mid-
    // transition), so unlisted blocks and neighbours sharing a stage hold.
    const targetStage = () => {
      if (anchors.length === 0) return 0;
      const vh = window.innerHeight;
      let value = anchors[0].stage;
      for (let i = 1; i < anchors.length; i++) {
        const top = anchors[i].top - window.scrollY;
        const t = clamp((vh * 0.55 - top) / (vh * 0.3), 0, 1);
        value += (anchors[i].stage - value) * t;
      }
      return value;
    };

    measure();
    const start = performance.now();
    let frame = 0;
    let time = 0;
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
      if (!frame && !reduceMotion) frame = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Reduced motion: no clock, and the formation switches without a tween.
    const onScroll = () => {
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

    // Pause rendering while none of the content is on screen.
    const intersectionObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) startLoop();
            else stopLoop();
          })
        : null;
    if (intersectionObserver) intersectionObserver.observe(content);
    else startLoop();

    const onContextLost = (event: Event) => {
      event.preventDefault();
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
      intersectionObserver?.disconnect();
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
          (and clear it) on every scroll. */}
      <div ref={stickyRef} className="sticky top-0 h-lvh">
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
