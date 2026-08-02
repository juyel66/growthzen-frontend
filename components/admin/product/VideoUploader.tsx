'use client';

import React, { useState } from 'react';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Video, Plus, X } from 'lucide-react';

interface VideoUploaderProps {
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({ watch, setValue }) => {
  const productVideos = watch('productVideos') || [];
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const handleAddVideo = () => {
    const trimmed = videoUrlInput.trim();
    if (trimmed && !productVideos.includes(trimmed)) {
      setValue('productVideos', [...productVideos, trimmed], { shouldValidate: true });
      setVideoUrlInput('');
    }
  };

  const handleRemoveVideo = (index: number) => {
    const updated = productVideos.filter((_, i) => i !== index);
    setValue('productVideos', updated, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        Product Demo Videos (Optional)
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={videoUrlInput}
          onChange={(e) => setVideoUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddVideo();
            }
          }}
          placeholder="Paste video URL (MP4, YouTube, Vimeo)..."
          className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="button"
          onClick={handleAddVideo}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>

      {/* Video Previews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productVideos.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group flex items-center justify-center"
          >
            <video controls className="w-full h-full object-cover">
              <source src={url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              type="button"
              onClick={() => handleRemoveVideo(idx)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition cursor-pointer shadow-md z-10"
              title="Remove video"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoUploader;
