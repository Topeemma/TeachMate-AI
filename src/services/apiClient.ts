import { FullLessonPackage, GenerateLessonRequest, LanguageCode, GradeLevel, SubjectName } from '../types';

export interface HealthCheckResponse {
  status: string;
  systemName: string;
  version: string;
  keys: {
    geminiKeyConfigured: boolean;
    pixverseKeyConfigured: boolean;
    teachmateKeyConfigured: boolean;
  };
  timestamp: string;
}

export interface UploadResponse {
  uploadId: string;
  originalName: string;
  sanitizedName: string;
  sizeBytes: number;
  piiWarning: boolean;
  piiMessage?: string;
  extractedSummary: string;
  uploadedAt: string;
}

export interface VideoResponse {
  message?: string;
  job?: {
    packageId: string;
    jobId: string;
    status: 'pending' | 'processing' | 'generated' | 'fallback';
    topicPrompt: string;
    videoUrl?: string;
  };
  videoUrl?: string;
}

export interface VideoStatusResponse {
  packageId: string;
  jobId?: string;
  status: 'pending' | 'processing' | 'generated' | 'fallback';
  videoUrl?: string;
  topicPrompt?: string;
  isReadOnlyStatus: boolean;
}

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error?.message || data.error || `HTTP error ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  }

  public static async getHealth(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/api/health');
  }

  public static async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<UploadResponse>('/api/uploads', {
      method: 'POST',
      body: formData,
    });
  }

  public static async generatePackage(
    payload: GenerateLessonRequest & {
      classSize?: number;
      term?: string;
      week?: number;
      teacherInstructions?: string;
      sourceUploadId?: string;
      outputSelections?: string[];
      language?: LanguageCode;
    },
    idempotencyKey?: string
  ): Promise<FullLessonPackage> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers['X-Idempotency-Key'] = idempotencyKey;
    }

    return this.request<FullLessonPackage>('/api/packages/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  }

  public static async getPackage(packageId: string): Promise<FullLessonPackage> {
    return this.request<FullLessonPackage>(`/api/packages/${packageId}`);
  }

  public static async reviewSection(
    packageId: string,
    sectionKey: string,
    status: 'needs_review' | 'approved',
    comments?: string
  ): Promise<any> {
    return this.request(`/api/packages/${packageId}/review`, {
      method: 'POST',
      body: JSON.stringify({ sectionKey, status, comments }),
    });
  }

  public static async approvePackage(packageId: string): Promise<{ message: string; package: FullLessonPackage }> {
    return this.request<{ message: string; package: FullLessonPackage }>(`/api/packages/${packageId}/approve`, {
      method: 'POST',
    });
  }

  public static async translateSection(
    packageId: string,
    text: string,
    targetLanguage: LanguageCode
  ): Promise<{ translatedText: string; targetLanguage: string; languageName: string }> {
    return this.request<{ translatedText: string; targetLanguage: string; languageName: string }>(
      `/api/packages/${packageId}/translate`,
      {
        method: 'POST',
        body: JSON.stringify({ text, targetLanguage }),
      }
    );
  }

  public static async generateVideo(packageId: string, topicPrompt: string): Promise<VideoResponse> {
    return this.request<VideoResponse>(`/api/packages/${packageId}/generate-video`, {
      method: 'POST',
      body: JSON.stringify({ topicPrompt, durationSeconds: 15 }),
    });
  }

  public static async getVideoStatus(packageId: string): Promise<VideoStatusResponse> {
    return this.request<VideoStatusResponse>(`/api/packages/${packageId}/video-status`);
  }

  public static async exportPackage(
    packageId: string,
    format: 'pdf' | 'docx' | 'markdown' | 'json' | 'pptx' | 'zip' | 'print_ready'
  ): Promise<{ exportId?: string; filename: string; downloadUrl?: string; content?: string }> {
    return this.request(`/api/packages/${packageId}/export`, {
      method: 'POST',
      body: JSON.stringify({ format, includeAnswerKeys: true }),
    });
  }

  public static async getHistory(): Promise<{ total: number; packages: FullLessonPackage[] }> {
    return this.request<{ total: number; packages: FullLessonPackage[] }>('/api/history');
  }
}
