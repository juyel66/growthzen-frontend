'use client';

import React from 'react';
import { Video } from 'lucide-react';

interface ProductVideoProps {
  videos?: string[];
}

export const ProductVideo: React.FC<ProductVideoProps> = ({ videos }) => {
  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-8 border-t border-slate-200 dark:border-slate-800 my-6">
      <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
        <Video className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        Product Demo & Overview Video
      </div>

      <div className="grid grid-cols-1 gap-6">
        {videos.map((videoUrl, idx) => {
          // Check if YouTube / Vimeo embed or HTML5 MP4 video
          const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
          const isVimeo = videoUrl.includes('vimeo.com');

          let embedSrc = videoUrl;
          if (isYouTube) {
            const ytId = videoUrl.split('v=')[1] || videoUrl.split('/').pop();
            embedSrc = `https://www.youtube.com/embed/${ytId}`;
          } else if (isVimeo) {
            const vimeoId = videoUrl.split('/').pop();
            embedSrc = `https://player.vimeo.com/video/${vimeoId}`;
          }

          return (
            <div
              key={idx}
              className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md"
            >
              {isYouTube || isVimeo ? (
                <iframe
                  src={embedSrc}
                  title={`Product Demo Video ${idx + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-cover"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVideo;

