/**
 * Spatial photo renderer: draws the hero photograph through a depth map with
 * parallax occlusion mapping, so near (lawn) and far (sky) layers separate as
 * the virtual camera moves. It pivots on `focus` depth, so the house holds still
 * while the lawn and sky drift in opposite directions.
 *
 * Depth maps are generated offline (see scripts/generate-depth.mjs): white = near.
 */

const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = vec2(aPosition.x * .5 + .5, .5 - aPosition.y * .5);
  gl_Position = vec4(aPosition, 0., 1.);
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2 uOffset;   // camera offset, already scaled to UV units
uniform vec2 uCrop;     // visible fraction of the image (object-fit: cover)
uniform vec2 uPosition; // object-position as 0..1
uniform float uFocus;   // depth that stays still
varying vec2 vUv;
const float STEPS = 28.;

float distanceAt(vec2 uv) { return 1. - texture2D(uDepth, uv).r; }

void main() {
  vec2 uv = uPosition * (1. - uCrop) + vUv * uCrop;
  float pivot = 1. - uFocus;
  vec2 start = uv + uOffset * pivot;
  vec2 stepUv = uOffset / STEPS;
  float layer = 0.;
  vec2 current = start;
  float surface = distanceAt(current);
  for (float i = 0.; i < STEPS; i++) {
    if (layer >= surface) break;
    current -= stepUv;
    surface = distanceAt(current);
    layer += 1. / STEPS;
  }
  vec2 previous = current + stepUv;
  float after = surface - layer;
  float before = distanceAt(previous) - layer + 1. / STEPS;
  float weight = after / (after - before + 1e-5);
  vec2 hit = mix(current, previous, clamp(weight, 0., 1.));
  gl_FragColor = texture2D(uImage, clamp(hit, 0., 1.));
}`;

export type DepthScene = {
  render: (x: number, y: number) => void;
  resize: () => void;
  dispose: () => void;
};

const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

/** Resolves to null when WebGL or the assets are unavailable; the static <picture> remains. */
export async function createDepthScene(canvas: HTMLCanvasElement, photo: HTMLImageElement, options: { depthSrc: string; focus: number; strength: [number, number] }): Promise<DepthScene | null> {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'shader');
    return shader;
  };
  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  } catch { return null; }

  let source: HTMLImageElement, depth: HTMLImageElement;
  try {
    if (!photo.complete || !photo.naturalWidth) await new Promise(resolve => photo.addEventListener('load', resolve, { once: true }));
    [source, depth] = await Promise.all([loadImage(photo.currentSrc || photo.src), loadImage(options.depthSrc)]);
  } catch { return null; }
  if (gl.isContextLost()) return null;

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = (unit: number, image: HTMLImageElement, format: number) => {
    const handle = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, handle);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, image);
    return handle;
  };
  const textures = [texture(0, source, gl.RGB), texture(1, depth, gl.LUMINANCE)];
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(uniform('uImage'), 0);
  gl.uniform1i(uniform('uDepth'), 1);
  gl.uniform1f(uniform('uFocus'), options.focus);
  const offset = uniform('uOffset'), crop = uniform('uCrop'), objectPosition = uniform('uPosition');

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, canvas.clientWidth < 768 ? 1.5 : 1.25);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr)), height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    gl.viewport(0, 0, width, height);
    // Mirror object-fit: cover and the photo's CSS object-position so the canvas lines up with the <picture>.
    const canvasRatio = canvas.clientWidth / canvas.clientHeight, imageRatio = source.naturalWidth / source.naturalHeight;
    gl.uniform2f(crop, canvasRatio > imageRatio ? 1 : canvasRatio / imageRatio, canvasRatio > imageRatio ? imageRatio / canvasRatio : 1);
    const [px = '50%', py = '50%'] = getComputedStyle(photo).objectPosition.split(' ');
    const percent = (value: string) => value === 'center' ? 0.5 : value === 'left' || value === 'top' ? 0 : value === 'right' || value === 'bottom' ? 1 : parseFloat(value) / 100;
    gl.uniform2f(objectPosition, percent(px), percent(py));
  };
  resize();

  return {
    resize,
    render(x, y) {
      gl.uniform2f(offset, x * options.strength[0], y * options.strength[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      textures.forEach(handle => gl.deleteTexture(handle));
      gl.deleteBuffer(buffer); gl.deleteProgram(program);
    },
  };
}
