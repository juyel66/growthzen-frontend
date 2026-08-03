'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { ThumbnailUploader } from './media/ThumbnailUploader';
import { UploadDropzone } from './media/UploadDropzone';
import { ImagePreview } from './media/ImagePreview';
import { validateImageFile, ACCEPT_IMAGE_STRING } from '@/constants/media';
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

  const handleBatchFilesSelected = (files: File[]) => {
    const validFiles: File[] = [];

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        Swal.fire({
          icon: 'error',
          title: 'File Rejected',
          text: validation.error || `File ${file.name} is invalid.`,
        });
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      const currentImages = watch('productImages') || [];
      setValue('productImages', [...currentImages, ...validFiles], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = productImages.filter((_, i) => i !== index);
    setValue('productImages', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleReplaceImage = (index: number, newFile: File) => {
    const validation = validateImageFile(newFile);
    if (!validation.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Image File',
        text: validation.error,
      });
      return;
    }

    const updated = [...productImages];
    updated[index] = newFile;
    setValue('productImages', updated, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
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
        </div>
      </div>

      {/* Gallery Previews Grid with Reordering & Actions */}
      {productImages.length > 0 && (
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Selected Gallery ({productImages.length})
            </h4>
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" /> Hover item to reorder, replace or remove
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {productImages.map((imgItem, idx) => {
              const src =
                imgItem instanceof File
                  ? URL.createObjectURL(imgItem)
                  : typeof imgItem === 'string'
                  ? imgItem
                  : '';

              return (
                <ImagePreview
                  key={imgItem instanceof File ? `${imgItem.name}-${idx}` : `${imgItem}-${idx}`}
                  src={src}
                  index={idx}
                  onRemove={() => handleRemoveImage(idx)}
                  onReplace={(file) => handleReplaceImage(idx, file)}
                  onMoveLeft={() => handleMoveLeft(idx)}
                  onMoveRight={() => handleMoveRight(idx)}
                  canMoveLeft={idx > 0}
                  canMoveRight={idx < productImages.length - 1}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
