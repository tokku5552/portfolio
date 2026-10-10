import { brandTokens } from '../../../../brand/tokens';
import { fragmentShader, vertexShader } from './shaders';

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as Rgb;
}

const colors = {
  bg: hexToRgb(brandTokens.color.bg),
  indigo: hexToRgb(brandTokens.color.orbIndigo),
  violet: hexToRgb(brandTokens.color.orbViolet),
  pink: hexToRgb(brandTokens.color.orbPink),
};

export interface ParticleRendererOptions {
  count: number;
  maxDpr: number;
}

export interface ParticleRenderer {
  /** Match the drawing buffer to the canvas' CSS size. */
  resize: () => void;
  /** Draw one frame. `stage` blends between formations (see shaders.ts). */
  draw: (time: number, stage: number) => void;
  dispose: () => void;
}

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(
      '[ParticleField] shader compile failed',
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Sets up the WebGL program for the particle field. Returns null when WebGL
 * is unavailable or the program fails to build, so callers can fall back to
 * a static background.
 */
export function createParticleRenderer(
  canvas: HTMLCanvasElement,
  { count, maxDpr }: ParticleRendererOptions
): ParticleRenderer | null {
  // failIfMajorPerformanceCaveat: on software rendering (blocklisted GPU,
  // VMs, remote desktops) drawing every frame on the CPU is worse than the
  // static fallback, so decline the context.
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, vertexShader);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(
      '[ParticleField] program link failed',
      gl.getProgramInfoLog(program)
    );
    return null;
  }

  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);

  gl.useProgram(program);
  const seedLoc = gl.getAttribLocation(program, 'a_seed');
  gl.enableVertexAttribArray(seedLoc);
  gl.vertexAttribPointer(seedLoc, 3, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uRes = u('u_res');
  const uTime = u('u_time');
  const uStage = u('u_stage');
  const uDpr = u('u_dpr');
  gl.uniform3fv(u('u_indigo'), colors.indigo);
  gl.uniform3fv(u('u_violet'), colors.violet);
  gl.uniform3fv(u('u_pink'), colors.pink);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(colors.bg[0], colors.bg[1], colors.bg[2], 1);

  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

  const resize = () => {
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    gl.uniform2f(uRes, width, height);
  };

  const draw = (time: number, stage: number) => {
    gl.uniform1f(uTime, time);
    gl.uniform1f(uStage, stage);
    gl.uniform1f(uDpr, dpr);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, count);
  };

  // Deletes our objects but keeps the context alive on purpose: React
  // StrictMode re-runs the effect on the same canvas in development, and
  // getContext must hand back a usable context the second time. Calling
  // loseContext() here would push that second run into the fallback.
  const dispose = () => {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };

  resize();
  return { resize, draw, dispose };
}
