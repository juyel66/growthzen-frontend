'use client';

import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { ThumbnailUploader } from './media/ThumbnailUploader';
import { UploadDropzone } from './media/UploadDropzone';
import { UploadProgress } from './media/UploadProgress';
import { ImagePreview } from './media/ImagePreview';
import { validateImageFile, ACCEPT_IMAGE_STRING } from '@/constants/media';
import { uploadMediaFile } from '@/services/uploadService';
import { UploadTask, UploadStatus } from '@/types/upload';
import { Image as ImageIcon, Images, Layers, ArrowRightLeft } from 'lucide-react';
import Swal from 'sweetalert2';

interface ImageUploaderProps {
  register?: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  onUploadingChange?: (isUploading: boolean) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  errors,
  watch,
  setValue,
  onUploadingChange,
}) => {
  const productImages = watch('productImages') || [];
  const [activeUploads, setActiveUploads] = useState<UploadTask[]>([]);

  // Notify parent component if any upload is active
  const notifyUploadingStatus = (tasks: UploadTask[]) => {
    if (onUploadingChange) {
      const isAnyUploading = tasks.some((t) => t.status === 'uploading');
      onUploadingChange(isAnyUploading);
    }
  };

  const uploadSingleFile = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'File Rejected',
        text: validation.error || 'Invalid image file.',
      });
      return;
    }

    const taskId = `gallery-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
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

      // Add uploaded URL to productImages array
      const currentImages = watch('productImages') || [];
      setValue('productImages', [...currentImages, result.url], { shouldValidate: true, shouldDirty: true, shouldTouch: true });

      // Remove from active uploads list after brief delay
      setTimeout(() => {
        setActiveUploads((prev) => {
          const next = prev.filter((t) => t.id !== taskId);
          notifyUploadingStatus(next);
          return next;
        });
      }, 600);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload';
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

  const handleBatchFilesSelected = (files: File[]) => {
    files.forEach((file) => {
      uploadSingleFile(file);
    });
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
    // Remove old task & start new
    setActiveUploads((prev) => prev.filter((t) => t.id !== task.id));
    uploadSingleFile(task.file);
  };

  const handleRemoveImage = (index: number) => {
    const updated = productImages.filter((_, i) => i !== index);
    setValue('productImages', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleReplaceImage = async (index: number, newFile: File) => {
    const validation = validateImageFile(newFile);
    if (!validation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image File',
        text: validation.error,
      });
      return;
    }

    try {
      const result = await uploadMediaFile(newFile);
      const updated = [...productImages];
      updated[index] = result.url;
      setValue('productImages', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Could not upload replacement image.';
      Swal.fire({
        icon: 'error',
        title: 'Replacement Failed',
        text: errorMessage,
      });
    }
  };

  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const updated = [...productImages];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setValue('productImages', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleMoveRight = (index: number) => {
    if (index >= productImages.length - 1) return;
    const updated = [...productImages];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setValue('productImages', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Product Images & Gallery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Upload main thumbnail and additional showcase images with drag & drop reordering.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Thumbnail Uploader */}
        <ThumbnailUploader
          watch={watch}
          setValue={setValue}
          errors={errors}
          onUploadingChange={onUploadingChange}
        />

        {/* Right Column: Multiple Gallery Images Dropzone & List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Images className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Gallery Images ({productImages.length})
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Multiple Images (Max 10MB each)</span>
          </div>

          <UploadDropzone
            onFilesSelected={handleBatchFilesSelected}
            accept={ACCEPT_IMAGE_STRING}
            multiple={true}
            title="Drag & Drop Gallery Images"
            subtitle="Drop multiple files here or click to browse"
            supportedFormatsText="JPG, PNG, WEBP, AVIF, GIF, SVG"
            maxSizeText="Max 10 MB each"
            iconType="image"
            className="w-full min-h-[160px]"
          />

          {/* Active Upload Tasks Progress List */}
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
      </div>

      {/* Gallery Previews Grid with Reordering & Actions */}
      {productImages.length > 0 && (
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Uploaded Gallery ({productImages.length})
            </h4>
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" /> Hover item to reorder, replace or remove
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {productImages.map((src, idx) => (
              <ImagePreview
                key={`${src}-${idx}`}
                src={src}
                index={idx}
                onRemove={() => handleRemoveImage(idx)}
                onReplace={(file) => handleReplaceImage(idx, file)}
                onMoveLeft={() => handleMoveLeft(idx)}
                onMoveRight={() => handleMoveRight(idx)}
                canMoveLeft={idx > 0}
                canMoveRight={idx < productImages.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
