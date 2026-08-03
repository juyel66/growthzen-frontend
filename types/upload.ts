export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error' | 'cancelled';

export interface UploadTask {
  id: string;
  file: File;
  progress: number; // 0 to 100
  status: UploadStatus;
  url?: string;
  error?: string;
  abortController?: AbortController;
}

export interface UploadResult {
  url: string;
  provider: string;
  key?: string;
  name: string;
  size: number;
  type: string;
}

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  folder?: string;
}

export interface IUploadProvider {
  name: string;
  uploadFile(file: File, options?: UploadOptions): Promise<UploadResult>;
}

export type VideoPlatform = 'local' | 'youtube' | 'facebook' | 'unknown';

export interface VideoPlatformInfo {
  platform: VideoPlatform;
  originalUrl: string;
  embedUrl: string;
  videoId?: string;
  isValid: boolean;
}
