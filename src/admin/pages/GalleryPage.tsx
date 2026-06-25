import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdminT } from '@/admin/i18n';
import { Modal } from '@/admin/components/Modal';
import { cn } from '@/utils';
import {
  getAllImages,
  addImage,
  removeImage,
  type GalleryImage,
} from '@/admin/utils/imageDb';
import { processImage, type ProcessOptions } from '@/admin/utils/imageProcessor';

const DEFAULT_OPTS: ProcessOptions = { maxWidth: 1200, maxHeight: 1200, quality: 0.82 };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const GalleryPage = () => {
  const t = useAdminT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [opts, setOpts] = useState(DEFAULT_OPTS);
  const [showSettings, setShowSettings] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [preview, setPreview] = useState<GalleryImage | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const reload = useCallback(async () => {
    const items = await getAllImages();
    setImages(items);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const uploadFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploading(true);
    for (const file of imageFiles) {
      try {
        const result = await processImage(file, opts);
        const item: GalleryImage = {
          id: crypto.randomUUID(),
          name: file.name.replace(/\.[^.]+$/, ''),
          dataUrl: result.dataUrl,
          width: result.width,
          height: result.height,
          size: result.size,
          createdAt: Date.now(),
        };
        await addImage(item);
      } catch (err) {
        console.error('Failed to process image:', file.name, err);
      }
    }
    await reload();
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const handleCopy = async (img: GalleryImage) => {
    await navigator.clipboard.writeText(img.dataUrl);
    setCopied(img.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await removeImage(deleteId);
    setDeleteId(null);
    await reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('gallery.title')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            {t('gallery.settings')}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {uploading ? t('gallery.uploading') : t('gallery.upload')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">{t('gallery.resizeSettings')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('gallery.maxWidth')}</label>
              <input
                type="number"
                value={opts.maxWidth}
                onChange={(e) => setOpts({ ...opts, maxWidth: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('gallery.maxHeight')}</label>
              <input
                type="number"
                value={opts.maxHeight}
                onChange={(e) => setOpts({ ...opts, maxHeight: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t('gallery.quality')} ({Math.round(opts.quality * 100)}%)</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opts.quality}
                onChange={(e) => setOpts({ ...opts, quality: Number(e.target.value) })}
                className="w-full mt-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors cursor-pointer',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-slate-300 hover:border-slate-400',
        )}
        onClick={() => fileRef.current?.click()}
      >
        <svg className="w-10 h-10 mx-auto mb-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-slate-500">{t('gallery.dropHint')}</p>
        <p className="text-xs text-slate-400 mt-1">{t('gallery.formats')}</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center text-slate-400 py-12">{t('common.loading')}</div>
      )}

      {/* Gallery grid */}
      {!loading && images.length === 0 && (
        <div className="text-center text-slate-400 py-12">{t('gallery.empty')}</div>
      )}

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden group">
              <div
                className="aspect-square bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => setPreview(img)}
              >
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2 space-y-1.5">
                <p className="text-xs font-medium text-slate-700 truncate" title={img.name}>{img.name}</p>
                <p className="text-[10px] text-slate-400">{img.width}×{img.height} · {formatSize(img.size)}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleCopy(img)}
                    className={cn(
                      'flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors',
                      copied === img.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-primary/10 text-primary hover:bg-primary/20',
                    )}
                  >
                    {copied === img.id ? t('gallery.copied') : t('gallery.copyUrl')}
                  </button>
                  <button
                    onClick={() => setDeleteId(img.id)}
                    className="px-2 py-1 text-[11px] text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.name ?? ''}>
        {preview && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={preview.dataUrl}
                alt={preview.name}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{preview.width}×{preview.height} · {formatSize(preview.size)}</span>
              <button
                onClick={() => handleCopy(preview)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  copied === preview.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-primary text-white hover:bg-primary-dark',
                )}
              >
                {copied === preview.id ? t('gallery.copied') : t('gallery.copyUrl')}
              </button>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">URL</label>
              <textarea
                readOnly
                value={preview.dataUrl}
                rows={3}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-[10px] text-slate-400 font-mono bg-slate-50 resize-none"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('gallery.deleteTitle')}>
        <p className="text-sm text-slate-600 mb-4">{t('gallery.deleteConfirm')}</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            {t('common.cancel')}
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">
            {t('common.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
};
