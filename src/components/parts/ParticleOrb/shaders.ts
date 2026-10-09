/**
 * GLSL ES 1.00 sources for ParticleOrb.
 *
 * The vertex shader does all the work (noise, layout, brand gradient) at the
 * default highp precision and hands the fragment shader varyings only. Keeping
 * uniforms out of the fragment shader avoids VS/FS precision mismatches, and
 * keeping noise in highp avoids banding on mobile GPUs where mediump is real.
 */

export const vertexShader = `
attribute vec3 a_seed;

uniform vec2 u_res;
uniform float u_time;
uniform float u_scatter;
uniform float u_dpr;
uniform vec3 u_indigo;
uniform vec3 u_violet;
uniform vec3 u_pink;

varying vec3 v_color;
varying float v_alpha;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

// The only gradient Twilight Blade allows: indigo -> violet -> pink.
vec3 brandGrad(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? mix(u_indigo, u_violet, t * 2.0) : mix(u_violet, u_pink, (t - 0.5) * 2.0);
}

void main() {
  bool narrow = u_res.x < 700.0;
  vec2 anchor = narrow ? vec2(u_res.x * 0.72, u_res.y * 0.72) : vec2(u_res.x * 0.70, u_res.y * 0.58);
  float radius = min(u_res.x, u_res.y) * (narrow ? 0.30 : 0.24);

  vec3 dir = normalize(a_seed * 2.0 - 1.0 + vec3(1e-4));
  float n = noise(dir * 1.8 + vec3(0.0, 0.0, u_time * 0.25));
  float r = 1.0 + (n - 0.5) * 0.7 + (fract(a_seed.x * 13.7) - 0.5) * 0.12;

  // Scroll scatter: each particle drifts outward at its own rate and wobbles
  // off the sphere so the shell unravels instead of just inflating.
  float spread = 0.8 + 2.2 * fract(a_seed.y * 7.13);
  vec3 jitter = vec3(fract(a_seed.z * 3.7), fract(a_seed.x * 5.3), fract(a_seed.y * 2.9)) - 0.5;
  vec3 p = dir * r * (1.0 + u_scatter * spread) + jitter * u_scatter * 1.2;

  float a = u_time * 0.12 + u_scatter * 0.8;
  p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
  float b = 0.35;
  p.yz = mat2(cos(b), -sin(b), sin(b), cos(b)) * p.yz;

  float persp = 2.4 / max(3.4 - p.z, 0.4);
  vec2 px = anchor + p.xy * persp * radius;
  gl_Position = vec4(px / u_res * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = (0.9 + 2.0 * persp) * u_dpr;

  v_color = brandGrad(0.5 + 0.24 * (p.x - p.y) + (n - 0.5) * 0.8);
  // Unravel first, fade out only over the second half of the scroll.
  float fade = 1.0 - smoothstep(0.4, 1.0, u_scatter);
  v_alpha = (0.26 + 0.8 * clamp(p.z * 0.5 + 0.5, 0.0, 1.0)) * fade;
}
`;

export const fragmentShader = `
precision mediump float;

varying vec3 v_color;
varying float v_alpha;

void main() {
  float m = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(v_color, m * v_alpha);
}
`;
