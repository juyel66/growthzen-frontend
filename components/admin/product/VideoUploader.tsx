'use client';

import React, { useState } from 'react';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { UploadDropzone } from './media/UploadDropzone';
import { UploadProgress } from './media/UploadProgress';
import { VideoPreview } from './media/VideoPreview';
import { validateVideoFile, ACCEPT_VIDEO_STRING } from '@/constants/media';
import { uploadMediaFile, parseVideoUrl } from '@/services/uploadService';
import { UploadTask, UploadStatus } from '@/types/upload';
import { Video, Youtube, Facebook, Plus, Link as LinkIcon, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

interface VideoUploaderProps {
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  onUploadingChange?: (isUploading: boolean) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  watch,
  setValue,
  onUploadingChange,
}) => {
  const productVideos = watch('productVideos') || [];
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube' | 'facebook'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [activeUploads, setActiveUploads] = useState<UploadTask[]>([]);

  const notifyUploadingStatus = (tasks: UploadTask[]) => {
    if (onUploadingChange) {
      const isAnyUploading = tasks.some((t) => t.status === 'uploading');
      onUploadingChange(isAnyUploading);
    }
  };

  const uploadLocalVideoFile = async (file: File) => {
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Video Rejected',
        text: validation.error || 'Invalid video file.',
      });
      return;
    }

    const taskId = `video-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const abortController = new AbortController();

    const task: UploadTask = {
      id: taskId,
      file,
      progress: 0,
      status: 'uploading',
      abortController,
    };

    setActiveUploads((prev) => {
      const next = [...prev, task];
      notifyUploadingStatus(next);
      return next;
    });

    try {
      const result = await uploadMediaFile(file, {
        signal: abortController.signal,
        onProgress: (progress) => {
          setActiveUploads((prev) => {
            const next = prev.map((t) => (t.id === taskId ? { ...t, progress } : t));
            notifyUploadingStatus(next);
            return next;
          });
        },
      });

      const currentVideos = watch('productVideos') || [];
      setValue('productVideos', [...currentVideos, result.url], { shouldValidate: true });

      setTimeout(() => {
        setActiveUploads((prev) => {
          const next = prev.filter((t) => t.id !== taskId);
          notifyUploadingStatus(next);
          return next;
        });
      }, 600);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload video';
      const isCancelled = errorMessage === 'Upload cancelled';
      const taskStatus: UploadStatus = isCancelled ? 'cancelled' : 'error';
      setActiveUploads((prev) => {
        const next = prev.map((t) =>
          t.id === taskId
            ? {
              ...t,
              status: taskStatus,
              error: isCancelled ? 'Upload cancelled' : errorMessage,
            }
            : t
        );
        notifyUploadingStatus(next);
        return next;
      });
    }
  };

  const handleFilesSelected = (files: File[]) => {
    files.forEach((file) => {
      uploadLocalVideoFile(file);
    });
  };

  const handleAddUrlVideo = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    const parsed = parseVideoUrl(trimmed);

    if (!parsed.isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Video Link',
        text:
          activeTab === 'youtube'
            ? 'Please enter a valid YouTube video or shorts URL.'
            : activeTab === 'facebook'
              ? 'Please enter a valid Facebook video link.'
              : 'Please enter a valid video URL.',
      });
      return;
    }

    if (!productVideos.includes(parsed.originalUrl)) {
      setValue('productVideos', [...productVideos, parsed.originalUrl], { shouldValidate: true });
      setUrlInput('');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Duplicate Video',
        text: 'This video URL is already added.',
      });
    }
  };

  const handleRemoveVideo = (index: number) => {
    const updated = productVideos.filter((_, i) => i !== index);
    setValue('productVideos', updated, { shouldValidate: true });
  };

  const handleReplaceLocalVideo = async (index: number, newFile: File) => {
    const validation = validateVideoFile(newFile);
    if (!validation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Video File',
        text: validation.error,
      });
      return;
    }

    try {
      const result = await uploadMediaFile(newFile);
      const updated = [...productVideos];
      updated[index] = result.url;
      setValue('productVideos', updated, { shouldValidate: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Could not upload replacement video.';
      Swal.fire({
        icon: 'error',
        title: 'Video Replacement Failed',
        text: errorMessage,
      });
    }
  };

  const handleCancelTask = (taskId: string) => {
    setActiveUploads((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (task?.abortController) {
        task.abortController.abort();
      }
      return prev;
    });
  };

  const handleRetryTask = (task: UploadTask) => {
    setActiveUploads((prev) => prev.filter((t) => t.id !== task.id));
    uploadLocalVideoFile(task.file);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Product Demo Videos ({productVideos.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Upload local video files or embed videos from YouTube and Facebook.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for 3 upload methods */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Local Video
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" /> YouTube
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('facebook')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Facebook className="w-3.5 h-3.5" /> Facebook
          </button>
        </div>

        {/* Tab Content 1: Local Video Drag & Drop Upload */}
        {activeTab === 'upload' && (
          <div className="flex flex-col gap-3">
            <UploadDropzone
              onFilesSelected={handleFilesSelected}
              accept={ACCEPT_VIDEO_STRING}
              multiple={true}
              title="Drag & Drop Video File"
              subtitle="Drop MP4, MOV, or WEBM video files here"
              supportedFormatsText="MP4, MOV, WEBM"
              maxSizeText="Max 100 MB"
              iconType="video"
              className="w-full min-h-[140px]"
            />
          </div>
        )}

        {/* Tab Content 2 & 3: Paste YouTube / Facebook URL */}
        {(activeTab === 'youtube' || activeTab === 'facebook') && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrlVideo();
                    }
                  }}
                  placeholder={
                    activeTab === 'youtube'
                      ? 'Paste YouTube video link (e.g. https://www.youtube.com/watch?v=...)'
                      : 'Paste Facebook video link (e.g. https://www.facebook.com/watch/?v=...)'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrlVideo}
                className={`px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-1.5 text-white transition cursor-pointer shadow-xs ${
                  activeTab === 'youtube'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Plus className="w-4 h-4" /> Add Video
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-slate-400" />
              Links are automatically detected and converted into high-performance embedded player cards.
            </p>
          </div>
        )}

        {/* Active Local Video Upload Tasks */}
        {activeUploads.length > 0 && (
          <div className="flex flex-col gap-2 my-2">
            {activeUploads.map((task) => (
              <UploadProgress
                key={task.id}
                fileName={task.file.name}
                fileSize={task.file.size}
                progress={task.progress}
                status={task.status}
                error={task.error}
                onCancel={() => handleCancelTask(task.id)}
                onRetry={() => handleRetryTask(task)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Previews List Grid */}
      {productVideos.length > 0 && (
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Video className="w-4 h-4 text-emerald-600" />
            Uploaded Video Demos ({productVideos.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productVideos.map((url, idx) => (
              <VideoPreview
                key={`${url}-${idx}`}
                src={url}
                index={idx}
                onRemove={() => handleRemoveVideo(idx)}
                onReplace={(file) => handleReplaceLocalVideo(idx, file)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;

