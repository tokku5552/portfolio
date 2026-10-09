import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/libs/cn';
import Orb from '../Orb';
import { createParticleRenderer } from './renderer';

type Mode = 'pending' | 'webgl' | 'fallback';

export type ParticleOrbProps = HTMLAttributes<HTMLDivElement>;

const NARROW_BREAKPOINT = 700;

/**
 * WebGL particle sphere for the hero background. It fills its positioned
 * parent and unravels as the parent scrolls out of view. Falls back to the
 * CSS `Orb` when WebGL is unavailable, and draws a single still frame when the
 * user prefers reduced motion.
 */
export function ParticleOrb({ className, ...rest }: ParticleOrbProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>('pending');

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

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

    const scrollProgress = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.height <= 0) return 0;
      return Math.min(Math.max(-rect.top / rect.height, 0), 1);
    };

    const start = performance.now();
    let frame = 0;
    let scatter = reduceMotion ? 0 : scrollProgress();

    const tick = (now: number) => {
      scatter += (scrollProgress() - scatter) * 0.12;
      renderer.draw((now - start) / 1000, scatter);
      frame = requestAnimationFrame(tick);
    };
    const startLoop = () => {
      if (!frame && !reduceMotion) frame = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onResize = () => {
      renderer.resize();
      if (reduceMotion) renderer.draw(0, 0);
    };
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(onResize)
        : null;
    resizeObserver?.observe(wrap);

    // Pause rendering while the hero is off screen.
    const intersectionObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) startLoop();
            else stopLoop();
          })
        : null;
    if (intersectionObserver) intersectionObserver.observe(wrap);
    else startLoop();

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stopLoop();
      setMode('fallback');
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    renderer.draw(0, scatter);
    setMode('webgl');

    return () => {
      stopLoop();
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
      className={cn('pointer-events-none absolute inset-0 z-0', className)}
      {...rest}
    >
      {mode === 'fallback' ? (
        <Orb position="tr" />
      ) : (
        <canvas
          ref={canvasRef}
          className={cn(
            'block h-full w-full transition-opacity duration-1000',
            mode === 'webgl' ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
}

export default ParticleOrb;
