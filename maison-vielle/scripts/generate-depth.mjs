// Generates the hero depth maps used by the spatial photo effect (components/maison/hero-depth.ts).
// Depth Anything V2 runs locally through transformers.js; it is not a project dependency, so install it ad hoc:
//   npm i --no-save @huggingface/transformers && npm run media:depth
// Output: public/media/images/hero/<id>-depth.webp, white = near. The first run downloads the model (~390 MB).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

let transformers;
try { transformers = await import('@huggingface/transformers'); }
catch { console.error('Missing @huggingface/transformers. Run: npm i --no-save @huggingface/transformers'); process.exit(1); }
const { pipeline, RawImage } = transformers;

const root = fileURLToPath(new URL('../public/media/images/', import.meta.url));
const jobs = [
  { source: 'estate/maison-vielle-estate-2000.webp', output: 'hero/maison-vielle-estate-depth.webp', width: 1024 },
  { source: 'hero/maison-vielle-estate-mobile-768.webp', output: 'hero/maison-vielle-estate-mobile-depth.webp', width: 512 },
];

/** Grayscale dilation (separable max filter); sharp's dilate is binary and would band the depth. */
function growNear(pixels, width, height, radius) {
  const pass = (input, horizontal) => {
    const output = new Uint8Array(input.length);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      let max = 0;
      for (let k = -radius; k <= radius; k++) {
        const sx = horizontal ? Math.min(width - 1, Math.max(0, x + k)) : x;
        const sy = horizontal ? y : Math.min(height - 1, Math.max(0, y + k));
        max = Math.max(max, input[sy * width + sx]);
      }
      output[y * width + x] = max;
    }
    return output;
  };
  return pass(pass(pixels, true), false);
}

const estimator = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-base', { dtype: 'fp32' });
for (const job of jobs) {
  const source = root + job.source;
  const image = await RawImage.fromBlob(new Blob([await sharp(source).png().toBuffer()]));
  const { predicted_depth: depth } = await estimator(image);
  const [height, width] = depth.dims.slice(-2);
  let min = Infinity, max = -Infinity;
  for (const value of depth.data) { if (value < min) min = value; if (value > max) max = value; }
  const bytes = Uint8Array.from(depth.data, value => Math.round(((value - min) / (max - min)) * 255));
  const { width: sourceWidth, height: sourceHeight } = await sharp(source).metadata();
  // Grow near regions slightly, then soften: parallax stretching lands on smooth sky rather than on masonry edges.
  const outWidth = job.width, outHeight = Math.round(job.width * sourceHeight / sourceWidth);
  const resized = await sharp(Buffer.from(bytes), { raw: { width, height, channels: 1 } })
    .resize(outWidth, outHeight, { fit: 'fill' }).extractChannel(0).raw().toBuffer();
  await sharp(Buffer.from(growNear(resized, outWidth, outHeight, 3)), { raw: { width: outWidth, height: outHeight, channels: 1 } })
    .blur(2.5).toColourspace('b-w').webp({ quality: 82 }).toFile(root + job.output);
  console.log('wrote', job.output);
}
