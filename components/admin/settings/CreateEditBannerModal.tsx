"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BannerItem, CreateBannerInput } from "@/types/settings";
import { uploadMediaFile } from "@/services/uploadService";
import { formatImageUrl } from "@/utils/imageUrl";
import {
  X,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  CheckCircle,
  Eye,
  Link as LinkIcon,
  Layers,
} from "lucide-react";
import Swal from "sweetalert2";

const bannerSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().min(5, "Image URL or uploaded file is required"),
  buttonText: z.string().optional(),
  buttonUrl: z.string().optional(),
  displayOrder: z.number().int().min(0, "Display order must be 0 or greater"),
  isActive: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface CreateEditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBanner: (data: CreateBannerInput | FormData) => Promise<void>;
  bannerToEdit?: BannerItem | null;
  isLoading?: boolean;
}

export const CreateEditBannerModal: React.FC<CreateEditBannerModalProps> = ({
  isOpen,
  onClose,
  onSubmitBanner,
  bannerToEdit,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      image: "",
      buttonText: "Shop Now",
      buttonUrl: "/shop",
      displayOrder: 1,
      isActive: true,
    },
  });

  const watchedValues = watch();
  const formattedPreview = formatImageUrl(watchedValues.image);
  const isLocalDevUrl =
    formattedPreview.startsWith("http://localhost") ||
    formattedPreview.startsWith("http://127.0.0.1");

  useEffect(() => {
    setSelectedFile(null);
    if (bannerToEdit) {
      reset({
        title: bannerToEdit.title || "",
        subtitle: bannerToEdit.subtitle || "",
        description: bannerToEdit.description || "",
        image: bannerToEdit.image || "",
        buttonText: bannerToEdit.buttonText || "",
        buttonUrl: bannerToEdit.buttonUrl || bannerToEdit.buttonLink || "",
        displayOrder: bannerToEdit.displayOrder ?? 1,
        isActive: bannerToEdit.isActive !== false,
      });
    } else {
      reset({
        title: "",
        subtitle: "",
        description: "",
        image: "",
        buttonText: "Shop Now",
        buttonUrl: "/shop",
        displayOrder: 1,
        isActive: true,
      });
    }
  }, [bannerToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File Type",
        text: "Please upload an image file (PNG, JPG, WEBP).",
      });
      return;
    }

    setSelectedFile(file);

    try {
      setIsUploading(true);
      setUploadProgress(10);
      const res = await uploadMediaFile(file, {
        onProgress: (percent) => setUploadProgress(percent),
      });

      if (res?.url && !res.url.startsWith("blob:")) {
        setValue("image", res.url, { shouldValidate: true });
      } else {
        const localBlob = URL.createObjectURL(file);
        setValue("image", localBlob, { shouldValidate: true });
      }

      Swal.fire({
        icon: "success",
        title: "Image Selected",
        text: "Banner image selected for submission.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err: any) {
      const localBlob = URL.createObjectURL(file);
      setValue("image", localBlob, { shouldValidate: true });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const onFormSubmit = async (data: BannerFormData) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", data.title || "");
      formData.append("subtitle", data.subtitle || "");
      formData.append("description", data.description || "");
      formData.append("buttonText", data.buttonText || "");
      formData.append("buttonUrl", data.buttonUrl || "");
      formData.append("displayOrder", String(data.displayOrder ?? 0));
      formData.append("isActive", String(data.isActive));

      await onSubmitBanner(formData);
    } else {
      if (data.image.startsWith("blob:")) {
        Swal.fire({
          icon: "error",
          title: "Invalid Image URL",
          text: "Temporary blob URLs cannot be saved to the database. Please select a valid file or enter a permanent URL.",
        });
        return;
      }

      const payload: CreateBannerInput = {
        title: data.title,
        subtitle: data.subtitle || "",
        description: data.description || "",
        image: data.image,
        buttonText: data.buttonText || "",
        buttonUrl: data.buttonUrl || "",
        displayOrder: Number(data.displayOrder ?? 1),
        isActive: Boolean(data.isActive),
      };

      await onSubmitBanner(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {bannerToEdit ? "Edit Banner" : "Create New Banner"}
              </h2>
              <p className="text-xs text-slate-500">
                {bannerToEdit
                  ? "Update banner parameters and live preview."
                  : "Add a high-converting hero banner to the homepage."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Form vs Preview Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`px-3 py-1 rounded-lg transition ${
                  activeTab === "form"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                  activeTab === "preview"
                    ? "bg-white dark:bg-slate-900 text-blue-600 shadow-2xs font-bold"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "preview" ? (
            /* Live Banner Preview Slide Simulation */
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Homepage Hero Slide Simulation
              </div>

              <div className="relative rounded-2xl overflow-hidden min-h-[260px] bg-slate-900 text-white flex flex-col justify-end p-8 shadow-xl border border-slate-800">
                {formattedPreview ? (
                  <Image
                    src={formattedPreview}
                    alt={watchedValues.title || "Banner Preview"}
                    fill
                    unoptimized={isLocalDevUrl}
                    className="object-cover opacity-60"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                    Upload an image to see live hero banner slide preview
                  </div>
                )}

                <div className="relative z-10 space-y-3 max-w-md">
                  {watchedValues.subtitle && (
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-extrabold uppercase tracking-widest">
                      {watchedValues.subtitle}
                    </span>
                  )}
                  <h3 className="text-2xl font-black text-white leading-tight">
                    {watchedValues.title || "Banner Title Here"}
                  </h3>
                  {watchedValues.description && (
                    <p className="text-xs text-slate-200 line-clamp-2">
                      {watchedValues.description}
                    </p>
                  )}
                  {watchedValues.buttonText && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg">
                        {watchedValues.buttonText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Banner Input Form */
            <form id="bannerForm" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Image Upload / URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Banner Image (Required)</span>
                  {watchedValues.image && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Image Selected
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* File Upload Box */}
                  <div className="md:col-span-2 relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex flex-col items-center justify-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 text-blue-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-semibold">Uploading... {uploadProgress}%</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-slate-400" />
                        <div className="text-xs">
                          <span className="font-bold text-blue-600">Click to upload image</span> or drag and drop
                        </div>
                        <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</span>
                      </>
                    )}
                  </div>

                  {/* Image Thumbnail Preview */}
                  <div className="relative rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center min-h-[100px]">
                    {formattedPreview ? (
                      <Image
                        src={formattedPreview}
                        alt="Uploaded preview"
                        fill
                        unoptimized={isLocalDevUrl}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-400">Preview</span>
                    )}
                  </div>
                </div>

                {/* Or Direct Image URL input */}
                <input
                  type="text"
                  placeholder="Or paste image URL directly (e.g. https://images.unsplash.com/...)"
                  {...register("image")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.image && (
                  <p className="text-[11px] font-medium text-rose-500">{errors.image.message}</p>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Summer Fashion Sale"
                    {...register("title")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {errors.title && (
                    <p className="text-[11px] font-medium text-rose-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subtitle / Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Up to 50% Off"
                    {...register("subtitle")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Elevate your wardrobe with top seasonal picks..."
                  {...register("description")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Button Text & Button URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Collection"
                    {...register("buttonText")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Button Link / URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /shop/fashion"
                    {...register("buttonUrl")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Display Sequence Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    {...register("displayOrder", { valueAsNumber: true })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {errors.displayOrder && (
                    <p className="text-[11px] font-medium text-rose-500">{errors.displayOrder.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Active Status
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Show or hide on homepage banner carousel
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchedValues.isActive}
                      onChange={(e) => setValue("isActive", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="bannerForm"
            disabled={isLoading || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{bannerToEdit ? "Save Changes" : "Create Banner"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEditBannerModal;
