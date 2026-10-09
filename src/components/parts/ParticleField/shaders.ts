/**
 * GLSL ES 1.00 sources for ParticleField.
 *
 * Every particle knows where it sits in each formation (one per page stage).
 * `u_stage` is a float: its integer part picks formation A, the next integer
 * picks formation B, and the fraction blends between them while the particles
 * scatter outwards mid-way, so one shape unravels into the next.
 *
 * The vertex shader does all the work at the default highp precision and hands
 * the fragment shader varyings only. Keeping uniforms out of the fragment
 * shader avoids VS/FS precision mismatches, and keeping noise in highp avoids
 * banding on mobile GPUs where mediump is real.
 */

/** Number of formations. Stage values are clamped to [0, STAGE_COUNT - 1]. */
export const STAGE_COUNT = 5;

export const vertexShader = `
attribute vec3 a_seed;

uniform vec2 u_res;
uniform float u_time;
uniform float u_stage;
uniform float u_dpr;
uniform vec3 u_indigo;
uniform vec3 u_violet;
uniform vec3 u_pink;

varying vec3 v_color;
varying float v_alpha;

const float PI = 3.14159265;

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

// u_res is in device pixels; compare in CSS pixels to match the JS breakpoint.
bool isNarrow() {
  return u_res.x / u_dpr < 700.0;
}

// Stage 0 (hero): noisy sphere slowly turning, upper right.
void sphere(out vec2 px, out float depth, out float grad) {
  bool narrow = isNarrow();
  vec2 anchor = narrow ? vec2(u_res.x * 0.72, u_res.y * 0.72) : vec2(u_res.x * 0.70, u_res.y * 0.58);
  float radius = min(u_res.x, u_res.y) * (narrow ? 0.30 : 0.24);

  vec3 dir = normalize(a_seed * 2.0 - 1.0 + vec3(1e-4));
  float n = noise(dir * 1.8 + vec3(0.0, 0.0, u_time * 0.25));
  float r = 1.0 + (n - 0.5) * 0.7 + (fract(a_seed.x * 13.7) - 0.5) * 0.12;
  vec3 p = dir * r;
  float a = u_time * 0.12;
  p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
  float b = 0.35;
  p.yz = mat2(cos(b), -sin(b), sin(b), cos(b)) * p.yz;

  float persp = 2.4 / (3.4 - p.z);
  px = anchor + p.xy * persp * radius;
  depth = p.z;
  grad = 0.5 + 0.24 * (p.x - p.y) + (n - 0.5) * 0.8;
}

// Stage 1 (podcast / youtube): three layered sound waves across the width.
void wave(out vec2 px, out float depth, out float grad) {
  float line = floor(a_seed.z * 3.0);
  float x = mix(-0.05, 1.05, a_seed.x);
  float k = x * (isNarrow() ? 9.0 : 14.0);
  float amp = u_res.y * 0.11 * (0.35 + 0.65 * noise(vec3(k * 0.35, u_time * 0.4, line * 3.1)));
  float y = sin(k + u_time * 1.1 + line * 2.1) * amp + sin(k * 2.7 - u_time * 0.7) * amp * 0.25;
  // Vertical bars give it a spectrum-like texture.
  y *= 0.55 + 0.45 * fract(a_seed.y * 9.7);
  px = vec2(x * u_res.x, u_res.y * 0.5 + y + (line - 1.0) * u_res.y * 0.05);
  depth = line - 1.0;
  grad = x;
}

// Stage 2 (services / works): a quiet lattice of points that breathes.
void grid(out vec2 px, out float depth, out float grad) {
  float cols = isNarrow() ? 12.0 : 34.0;
  float rows = isNarrow() ? 22.0 : 18.0;
  float c = floor(a_seed.x * cols);
  float r = floor(a_seed.y * rows);
  vec2 cell = vec2((c + 0.5) / cols, (r + 0.5) / rows);
  float pulse = noise(vec3(c * 0.4, r * 0.4, u_time * 0.35));
  vec2 jitter = (vec2(fract(a_seed.z * 7.3), fract(a_seed.z * 3.1)) - 0.5) * (1.5 + 3.0 * pulse);
  px = cell * u_res + jitter;
  depth = pulse * 2.0 - 1.0;
  grad = cell.x * 0.8 + cell.y * 0.2;
}

// Stage 3 (articles): columns of particles falling like lines of text.
void rain(out vec2 px, out float depth, out float grad) {
  float cols = isNarrow() ? 18.0 : 48.0;
  float c = floor(a_seed.x * cols);
  float speed = 0.04 + 0.06 * hash(vec3(c, 1.0, 7.0));
  float y = fract(a_seed.y + u_time * speed);
  px = vec2((c + 0.5) / cols * u_res.x, (1.0 - y) * u_res.y);
  depth = a_seed.z * 2.0 - 1.0;
  grad = (c + 0.5) / cols;
}

// Stage 4 (contact): particles gather into a tilted ring around a bright core.
// Contact is the last section, so by the time it is in view the canvas has
// started scrolling away with the page end; sit low in the canvas to stay
// on screen.
void ring(out vec2 px, out float depth, out float grad) {
  vec2 center = isNarrow() ? vec2(u_res.x * 0.76, u_res.y * 0.13) : vec2(u_res.x * 0.68, u_res.y * 0.32);
  float unit = min(u_res.x, u_res.y);
  float angle = a_seed.x * 2.0 * PI + u_time * 0.25;
  float r = unit * (isNarrow() ? 0.16 : 0.2) * (1.0 + (a_seed.y - 0.5) * 0.18);
  if (a_seed.z < 0.25) r *= a_seed.y * 0.25;
  px = center + vec2(cos(angle), sin(angle) * 0.38) * r;
  depth = sin(angle);
  grad = 0.5 + 0.5 * cos(angle);
}

void formation(float index, out vec2 px, out float depth, out float grad) {
  if (index < 0.5) sphere(px, depth, grad);
  else if (index < 1.5) wave(px, depth, grad);
  else if (index < 2.5) grid(px, depth, grad);
  else if (index < 3.5) rain(px, depth, grad);
  else ring(px, depth, grad);
}

// The hero is the accent; every other stage stays in the background. The
// grid stacks many particles per point, so it needs to be dimmer still.
float intensity(float index) {
  if (index < 0.5) return 1.0;
  if (index > 1.5 && index < 2.5) return 0.22;
  return 0.42;
}

// Rain wraps at the viewport edges; fade particles there so they never pop.
float edgeFade(float index, vec2 px) {
  if (index < 2.5 || index > 3.5) return 1.0;
  float y = px.y / u_res.y;
  return smoothstep(0.0, 0.08, y) * (1.0 - smoothstep(0.92, 1.0, y));
}

void main() {
  float a = floor(u_stage);
  float b = min(a + 1.0, ${STAGE_COUNT - 1}.0);
  float f = u_stage - a;
  float e = f * f * (3.0 - 2.0 * f);

  vec2 pxA; float depthA; float gradA;
  vec2 pxB; float depthB; float gradB;
  formation(a, pxA, depthA, gradA);
  formation(b, pxB, depthB, gradB);

  // Mid-transition the particles burst outwards, so a shape unravels before
  // the next one forms instead of sliding across as a plain tween.
  float s = sin(PI * f);
  float burst = s * s;
  vec2 jitter = vec2(fract(a_seed.z * 3.7), fract(a_seed.x * 5.3)) - 0.5;
  vec2 px = mix(pxA, pxB, e) + jitter * burst * min(u_res.x, u_res.y) * (0.6 + 0.8 * fract(a_seed.y * 7.13));
  float depth = mix(depthA, depthB, e);

  gl_Position = vec4(px / u_res * 2.0 - 1.0, 0.0, 1.0);
  float persp = 2.4 / (3.4 - clamp(depth, -1.0, 1.0));
  gl_PointSize = (0.9 + 2.0 * persp) * u_dpr;

  float n = noise(vec3(a_seed.xy * 6.0, u_time * 0.2));
  v_color = brandGrad(mix(gradA, gradB, e) + (n - 0.5) * 0.25);
  float alpha = 0.26 + 0.8 * clamp(depth * 0.5 + 0.5, 0.0, 1.0);
  float level = mix(intensity(a) * edgeFade(a, pxA), intensity(b) * edgeFade(b, pxB), e);
  v_alpha = alpha * level * (1.0 - 0.45 * burst);
}
`;

export const fragmentShader = `
precision mediump float;

varying vec3 v_color;
varying float v_alpha;

void main() {
  float m = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5));
  gl_FragColor = vec4(v_color, m * v_alpha);
}
`;
