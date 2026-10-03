import fs from 'node:fs/promises';
import sharp from 'sharp';
const entries=await fs.readdir('public/media',{recursive:true,withFileTypes:true});
let total=0;const errors=[];
for(const e of entries){if(!e.isFile())continue;const file=`${e.parentPath}/${e.name}`;const {size}=await fs.stat(file);total+=size;
if(/\.(avif|webp)$/.test(e.name)){const m=await sharp(file).metadata();if(!m.width||!m.height)errors.push(file);}
if(size>5*1024*1024)errors.push(`Oversized asset: ${file}`);
if(/\.(jpe?g|png)$/.test(e.name))errors.push(`Unoptimized photo: ${file}`);
}
console.log(`Production media total: ${(total/1024/1024).toFixed(2)} MiB`);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('All media readable; no oversized originals.');
