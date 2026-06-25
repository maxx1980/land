export interface ProcessOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

export interface ProcessedImage {
  dataUrl: string;
  width: number;
  height: number;
  size: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function processImage(file: File, opts: ProcessOptions): Promise<ProcessedImage> {
  const originalUrl = await readAsDataUrl(file);
  const img = await loadImage(originalUrl);

  let { width, height } = img;

  if (width > opts.maxWidth || height > opts.maxHeight) {
    const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  const supportsWebp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  const format = supportsWebp ? 'image/webp' : 'image/jpeg';
  const dataUrl = canvas.toDataURL(format, opts.quality);

  const size = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);

  return { dataUrl, width, height, size };
}
