import type { CSSProperties } from 'react';
import type { MediaAsset } from '@/content/media';

/** The `srcset` a ResponsiveImage uses for one asset and format (shared so other code can preload the same file). */
export const srcSetFor = (asset: MediaAsset, format: 'avif' | 'webp') =>
  asset.widths.map(w => `/media/images/${asset.category}/${asset.id}-${w}.${format} ${w}w`).join(', ');

export function ResponsiveImage({ asset, sizes = '100vw', priority = false, className = '', style, position = 'center', fit = 'cover', mobileAsset }: {
  asset: MediaAsset; mobileAsset?: MediaAsset; sizes?: string; priority?: boolean; className?: string;
  style?: CSSProperties; position?: string; fit?: CSSProperties['objectFit'];
}) {
  const base = `/media/images/${asset.category}/${asset.id}`;
  const srcSet = (format: 'avif' | 'webp') => srcSetFor(asset, format);
  const mobileSrcSet = (format: 'avif' | 'webp') => mobileAsset && srcSetFor(mobileAsset, format);
  return <picture className={`responsive-image ${className}`} style={style}>
    {mobileAsset && <><source media="(max-width: 767px)" type="image/avif" srcSet={mobileSrcSet('avif')} sizes="100vw" /><source media="(max-width: 767px)" type="image/webp" srcSet={mobileSrcSet('webp')} sizes="100vw" /></>}
    <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
    <img src={`${base}-${asset.widths[Math.min(2, asset.widths.length - 1)]}.webp`} width={asset.width} height={asset.height}
      alt={asset.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
      decoding="async" style={{ objectPosition: position, objectFit: fit }} />
  </picture>;
}
