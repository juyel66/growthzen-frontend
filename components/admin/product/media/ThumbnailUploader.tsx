'use client';

import React, { useState } from 'react';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { UploadDropzone } from './UploadDropzone';
import { UploadProgress } from './UploadProgress';
import { ImagePreview } from './ImagePreview';
import { validateImageFile, ACCEPT_IMAGE_STRING } from '@/constants/media';
import { uploadMediaFile } from '@/services/uploadService';
import { UploadTask } from '@/types/upload';
import { Star, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';

interface ThumbnailUploaderProps {
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onUploadingChange?: (isUploading: boolean) => void;
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  watch,
  setValue,
  errors,
  onUploadingChange,
}) => {
  const thumbnailImage = watch('thumbnailImage');
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);

  const startUpload = async (file: File) => {
    // 1. Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image File',
        text: validation.error || 'The selected file is not supported.',
      });
      return;
    }

    const taskId = `thumb-${Date.now()}`;
    const abortController = new AbortController();

    const initialTask: UploadTask = {
      id: taskId,
      file,
      progress: 0,
      status: 'uploading',
      abortController,
    };

    setUploadTask(initialTask);
    if (onUploadingChange) onUploadingChange(true);

    try {
      const result = await uploadMediaFile(file, {
        signal: abortController.signal,
        onProgress: (progress) => {
          setUploadTask((prev) => (prev ? { ...prev, progress } : null));
        },
      });

      setUploadTask({
        ...initialTask,
        progress: 100,
        status: 'completed',
        url: result.url,
      });

      // Update Form Value
      setValue('thumbnailImage', result.url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });

      setTimeout(() => {
        setUploadTask(null);
        if (onUploadingChange) onUploadingChange(false);
      }, 800);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      if (errorMessage === 'Upload cancelled') {
        setUploadTask({
          ...initialTask,
          status: 'cancelled',
          error: 'Upload cancelled by user',
        });
      } else {
        setUploadTask({
          ...initialTask,
          status: 'error',
          error: errorMessage,
        });
      }
      if (onUploadingChange) onUploadingChange(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      startUpload(files[0]);
    }
  };

  const handleCancelUpload = () => {
    if (uploadTask?.abortController) {
      uploadTask.abortController.abort();
    }
  };

  const handleRetryUpload = () => {
    if (uploadTask?.file) {
      startUpload(uploadTask.file);
    }
  };

  const handleRemove = () => {
    setValue('thumbnailImage', '', { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setUploadTask(null);
  };

  const handleReplaceFile = (file: File) => {
    startUpload(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Main Thumbnail Image *
        </label>
        <span className="text-[11px] text-slate-400 font-medium">Single Image (Max 10MB)</span>
      </div>

      {/* Main Container / Content */}
      {thumbnailImage ? (
        <ImagePreview
          src={thumbnailImage}
          alt="Product Main Thumbnail"
          isThumbnail={true}
          onRemove={handleRemove}
          onReplace={handleReplaceFile}
          className="w-full aspect-video rounded-2xl"
        />
      ) : (
        <UploadDropzone
          onFilesSelected={handleFilesSelected}
          accept={ACCEPT_IMAGE_STRING}
          multiple={false}
          title="Drag & Drop Main Thumbnail Image"
          subtitle="Click to browse or drop product thumbnail image here"
          supportedFormatsText="JPG, PNG, WEBP, AVIF, GIF, SVG"
          maxSizeText="Max 10 MB"
          disabled={uploadTask?.status === 'uploading'}
          iconType="image"
          className="w-full aspect-video border-dashed"
        />
      )}

      {/* Active Upload Progress indicator */}
      {uploadTask && (
        <UploadProgress
          fileName={uploadTask.file.name}
          fileSize={uploadTask.file.size}
          progress={uploadTask.progress}
          status={uploadTask.status}
          error={uploadTask.error}
          onCancel={handleCancelUpload}
          onRetry={handleRetryUpload}
        />
      )}

      {errors.thumbnailImage && (
        <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5" />
          {errors.thumbnailImage.message}
        </p>
      )}
    </div>
  );
};

export default ThumbnailUploader;
