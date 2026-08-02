'use client';

import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ProductFormValues } from '@/lib/validations/product';
import { Image as ImageIcon, Plus, X, Star, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  register,
  errors,
  watch,
  setValue,
}) => {
  const thumbnailImage = watch('thumbnailImage');
  const productImages = watch('productImages') || [];
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const handleAddGalleryImage = () => {
    const trimmed = galleryUrlInput.trim();
    if (trimmed && !productImages.includes(trimmed)) {
      setValue('productImages', [...productImages, trimmed], { shouldValidate: true });
      setGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = productImages.filter((_, i) => i !== index);
    setValue('productImages', updated, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-5 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200">
          <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Product Images & Media Gallery
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Thumbnail Image Upload/URL */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Main Thumbnail Image *
          </label>

          <div className="flex flex-col gap-2">
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('thumbnailImage')}
                placeholder="Enter image URL (e.g. https://res.cloudinary.com/.../thumb.webp)"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition ${
                  errors.thumbnailImage ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
                }`}
              />
            </div>
            {errors.thumbnailImage && (
              <span className="text-xs font-semibold text-rose-500">{errors.thumbnailImage.message}</span>
            )}
          </div>

          {/* Thumbnail Live Preview */}
          <div className="relative w-full aspect-video rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center">
            {thumbnailImage ? (
              <Image
                src={thumbnailImage}
                alt="Thumbnail Preview"
                fill
                sizes="300px"
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-400 text-xs">
                <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                <span>Thumbnail Preview</span>
              </div>
            )}
          </div>
        </div>

        {/* Multiple Product Images Upload/URLs */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Additional Product Gallery Images (Multiple)
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={galleryUrlInput}
              onChange={(e) => setGalleryUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGalleryImage();
                }
              }}
              placeholder="Paste image URL and click Add..."
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddGalleryImage}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Gallery Previews Grid */}
          <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {productImages.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden group"
              >
                <Image
                  src={url}
                  alt={`Gallery ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover p-1"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer shadow-md"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {productImages.length === 0 && (
              <div className="col-span-3 h-28 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                No additional gallery images added
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
