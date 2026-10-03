import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const manifest = JSON.parse(await fs.readFile(new URL('../content/media-manifest.json', import.meta.url), 'utf8'));
const sourceDir = process.env.MEDIA_SOURCE_DIR || '.cache/media';
const output = 'public/media/images';
const audit=[];
for(const asset of manifest.images){
  const source=path.join(sourceDir,asset.originalFilename);
  const original=await fs.stat(source);
  const metadata=await sharp(source).metadata();
  const folder=path.join(output,asset.category);await fs.mkdir(folder,{recursive:true});
  const files=[];
  for(const width of asset.widths.filter(w=>w<=metadata.width)){
    for(const format of ['avif','webp']){
      const file=path.join(folder,`${asset.id}-${width}.${format}`);
      let pipeline=sharp(source).rotate();
      if(asset.crop) pipeline=pipeline.extract(asset.crop);
      pipeline=pipeline.resize({width,withoutEnlargement:true}).modulate({saturation:0.9});
      if(format==='avif')pipeline=pipeline.avif({quality:asset.avifQuality||53,effort:4});
      else pipeline=pipeline.webp({quality:asset.webpQuality||79,effort:5});
      await pipeline.toFile(file);
      files.push({file,bytes:(await fs.stat(file)).size,width,format});
    }
  }
  audit.push({id:asset.id,usage:asset.usage,originalBytes:original.size,originalWidth:metadata.width,originalHeight:metadata.height,files});
  console.log(`${asset.id}: ${files.length} optimized variants`);
}
await fs.writeFile('docs/media-audit.json',JSON.stringify(audit,null,2)+'\n');
console.log(`Processed ${audit.length} images. See docs/media-audit.json.`);
