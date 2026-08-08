'use client';

import React, { useRef } from 'react';
import { X, RefreshCw, Video, Youtube, Facebook } from 'lucide-react';
import { parseVideoUrl } from '@/services/uploadService';
import { ACCEPT_VIDEO_STRING } from '@/constants/media';

interface VideoPreviewProps {
  src: string;
  index?: number;
  onRemove?: () => void;
  onReplace?: (file: File) => void;
  className?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  src,
  index,
  onRemove,
  onReplace,
  className = '',
}) => {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const info = parseVideoUrl(src);

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
    <div
      className={`relative group aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-sm transition-all duration-300 ${className}`}
    >
      {/* Video Content Renderer */}
      {info.platform === 'youtube' ? (
        <iframe
          src={info.embedUrl}
          title={`YouTube Video ${index !== undefined ? index + 1 : ''}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : info.platform === 'facebook' ? (
        <iframe
          src={info.embedUrl}
          title={`Facebook Video ${index !== undefined ? index + 1 : ''}`}
          className="w-full h-full border-0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <video controls className="w-full h-full object-cover">
          <source src={info.embedUrl || src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Platform Badge overlay */}
      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-xs text-white font-bold text-[10px] flex items-center gap-1.5 shadow-sm border border-slate-700/50 pointer-events-none z-10">
        {info.platform === 'youtube' ? (
          <>
            <Youtube className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> YouTube
          </>
        ) : info.platform === 'facebook' ? (
          <>
            <Facebook className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> Facebook
          </>
        ) : (
          <>
            <Video className="w-3.5 h-3.5 text-emerald-400" /> Direct / Local Video
          </>
        )}
        {typeof index === 'number' && <span className="opacity-60 ml-1">#{index + 1}</span>}
      </div>

      {/* Action Overlay */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity z-20">
        {onReplace && info.platform === 'local' && (
          <button
            type="button"
            onClick={handleReplaceClick}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-emerald-600 text-white transition cursor-pointer shadow-md border border-slate-700/50"
            title="Replace Video File"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition cursor-pointer shadow-md"
            title="Remove Video"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hidden Replace Input */}
      <input
        ref={replaceInputRef}
        type="file"
        accept={ACCEPT_VIDEO_STRING}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default VideoPreview;

