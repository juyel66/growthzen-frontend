'use client';

import React, { useState, useEffect } from 'react';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { UploadDropzone } from './UploadDropzone';
import { ImagePreview } from './ImagePreview';
import { validateImageFile, ACCEPT_IMAGE_STRING } from '@/constants/media';
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
}) => {
  const thumbnailVal = watch('thumbnailImage');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (thumbnailVal instanceof File) {
      const objectUrl = URL.createObjectURL(thumbnailVal);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof thumbnailVal === 'string' && thumbnailVal.trim()) {
      setPreviewUrl(thumbnailVal);
    } else {
      setPreviewUrl('');
    }
  }, [thumbnailVal]);

  const handleSelectFile = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image File',
        text: validation.error || 'The selected file is not supported.',
      });
      return;
    }

    // Set File object directly in React Hook Form for FormData submission
    setValue('thumbnailImage', file, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      handleSelectFile(files[0]);
    }
  };

  const handleRemove = () => {
    setValue('thumbnailImage', '', { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setPreviewUrl('');
  };

  const handleReplaceFile = (file: File) => {
    handleSelectFile(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Main Thumbnail Image *
        </label>
        <span className="text-[11px] text-slate-400 font-medium">Single Image File (Max 10MB)</span>
      </div>

      {/* Main Container / Content */}
      {previewUrl ? (
        <ImagePreview
          src={previewUrl}
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
          subtitle="Click to browse or drop product thumbnail image file here"
          supportedFormatsText="JPG, PNG, WEBP, AVIF, GIF, SVG"
          maxSizeText="Max 10 MB"
          iconType="image"
          className="w-full aspect-video border-dashed"
        />
      )}

      {errors.thumbnailImage && (
        <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5" />
          {typeof errors.thumbnailImage.message === 'string' ? errors.thumbnailImage.message : 'Thumbnail image is required'}
        </p>
      )}
    </div>
  );
};

export default ThumbnailUploader;

