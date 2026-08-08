'use client';

import React, { useRef, useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { X, RefreshCw, ChevronLeft, ChevronRight, Maximize2, Star } from 'lucide-react';
import { ACCEPT_IMAGE_STRING } from '@/constants/media';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  index?: number;
  isThumbnail?: boolean;
  onRemove?: () => void;
  onReplace?: (file: File) => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = 'Product Image',
  index,
  isThumbnail = false,
  onRemove,
  onReplace,
  onMoveLeft,
  onMoveRight,
  canMoveLeft = false,
  canMoveRight = false,
  className = '',
}) => {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleReplaceClick = () => {
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onReplace) {
        onReplace(file);
      }
      e.target.value = '';
    }
  };

  return (
    <>
      <div
        className={`relative group aspect-square rounded-2xl bg-slate-900/5 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-md hover:border-emerald-500/50 ${className}`}
      >
        <SafeImage
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 250px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge overlay (e.g. Main Thumbnail or Index) */}
        {isThumbnail ? (
          <div className="absolute top-2 left-2 px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-lg shadow-xs flex items-center gap-1 z-10">
            <Star className="w-3 h-3 fill-slate-950" /> Main Thumbnail
          </div>
        ) : typeof index === 'number' ? (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white font-bold text-[10px] rounded-md backdrop-blur-xs shadow-2xs z-10">
            #{index + 1}
          </div>
        ) : null}

        {/* Hover Action Controls Bar */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2 z-10 backdrop-blur-[2px]">
          {/* Top Actions */}
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white transition cursor-pointer"
              title="Enlarge Preview"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {onReplace && (
              <button
                type="button"
                onClick={handleReplaceClick}
                className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-emerald-600 text-white transition cursor-pointer"
                title="Replace Image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition cursor-pointer shadow-xs"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bottom Reorder Controls */}
          {(onMoveLeft || onMoveRight) && (
            <div className="flex items-center justify-center gap-2 bg-slate-900/80 backdrop-blur-xs rounded-xl p-1 shadow-inner">
              {onMoveLeft && (
                <button
                  type="button"
                  disabled={!canMoveLeft}
                  onClick={onMoveLeft}
                  className="p-1 text-white hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-white transition cursor-pointer"
                  title="Move Left / Earlier"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <span className="text-[10px] font-bold text-slate-300 px-1">Reorder</span>
              {onMoveRight && (
                <button
                  type="button"
                  disabled={!canMoveRight}
                  onClick={onMoveRight}
                  className="p-1 text-white hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-white transition cursor-pointer"
                  title="Move Later / Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hidden replace input */}
        <input
          ref={replaceInputRef}
          type="file"
          accept={ACCEPT_IMAGE_STRING}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Fullscreen Zoom Modal */}
      {isPreviewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={src}
              alt={alt}
              fill
              className="object-contain rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/90 text-white hover:bg-rose-600 transition cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;

