'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileVideo, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  supportedFormatsText?: string;
  maxSizeText?: string;
  disabled?: boolean;
  iconType?: 'image' | 'video';
  className?: string;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFilesSelected,
  accept,
  multiple = false,
  title = 'Drag & Drop your files here',
  subtitle = 'or click to browse from your computer',
  supportedFormatsText = 'JPG, PNG, WEBP, AVIF',
  maxSizeText = 'Up to 10 MB',
  disabled = false,
  iconType = 'image',
  className,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const filesToProcess = multiple ? droppedFiles : [droppedFiles[0]];
      onFilesSelected(filesToProcess);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(multiple ? selectedFiles : [selectedFiles[0]]);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative group cursor-pointer transition-all duration-300 rounded-2xl p-6 border-2 border-dashed flex flex-col items-center justify-center text-center overflow-hidden',
        isDragOver
          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 scale-[1.01] shadow-lg shadow-emerald-500/10'
          : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/60 dark:hover:bg-slate-850 hover:border-emerald-400 dark:hover:border-emerald-500',
        disabled && 'opacity-60 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Upload Icon Badge */}
      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xs mb-3.5',
          isDragOver
            ? 'bg-emerald-600 text-white scale-110 rotate-3'
            : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-700 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white'
        )}
      >
        {iconType === 'image' ? (
          <UploadCloud className="w-7 h-7 stroke-[1.75]" />
        ) : (
          <FileVideo className="w-7 h-7 stroke-[1.75]" />
        )}
      </div>

      {/* Text Info */}
      <div className="flex flex-col items-center gap-1 max-w-sm">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          {title}
          <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
      </div>

      {/* Supported Formats & Specs Footer Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          {supportedFormatsText}
        </span>
        <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
          {maxSizeText}
        </span>
      </div>
    </div>
  );
};

export default UploadDropzone;

