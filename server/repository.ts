import { FullLessonPackage } from '../src/types';

/**
 * TEACHMATE AI - IN-MEMORY SESSION & PACKAGE REPOSITORY
 * 
 * INTERNAL NOTICE: This repository is an in-memory/session-scoped temporary
 * data store for the application prototype. In production, this layer connects
 * to a persistent store (e.g., Firestore or Cloud SQL).
 */

export interface SessionData {
  id: string;
  createdAt: string;
  teacherName?: string;
  schoolName?: string;
  defaultGrade?: string;
  defaultSubject?: string;
}

export interface UploadRecord {
  id: string;
  originalName: string;
  sanitizedName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  piiWarning: boolean;
  piiMessage?: string;
  extractedSummary: string;
  rawText?: string;
}

export interface VideoJob {
  packageId: string;
  jobId: string;
  status: 'pending' | 'processing' | 'generated' | 'fallback';
  topicPrompt: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

class InMemoryRepository {
  private sessions = new Map<string, SessionData>();
  private uploads = new Map<string, UploadRecord>();
  private packages = new Map<string, FullLessonPackage>();
  private idempotencyStore = new Map<string, { status: number; body: any; timestamp: number }>();
  private videoJobs = new Map<string, VideoJob>();

  // Sessions
  public createSession(data: Omit<SessionData, 'id' | 'createdAt'>): SessionData {
    const id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const session: SessionData = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(id, session);
    return session;
  }

  public getSession(id: string): SessionData | undefined {
    return this.sessions.get(id);
  }

  // Uploads
  public saveUpload(upload: UploadRecord): UploadRecord {
    this.uploads.set(upload.id, upload);
    return upload;
  }

  public getUpload(id: string): UploadRecord | undefined {
    return this.uploads.get(id);
  }

  // Packages
  public savePackage(pkg: FullLessonPackage): FullLessonPackage {
    this.packages.set(pkg.id, pkg);
    return pkg;
  }

  public getPackage(id: string): FullLessonPackage | undefined {
    return this.packages.get(id);
  }

  public listPackages(): FullLessonPackage[] {
    return Array.from(this.packages.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public updatePackage(id: string, partial: Partial<FullLessonPackage>): FullLessonPackage | undefined {
    const existing = this.packages.get(id);
    if (!existing) return undefined;

    const updated: FullLessonPackage = {
      ...existing,
      ...partial,
      lessonPlan: partial.lessonPlan ? { ...existing.lessonPlan, ...partial.lessonPlan } : existing.lessonPlan,
      teacherNotes: partial.teacherNotes ? { ...existing.teacherNotes, ...partial.teacherNotes } : existing.teacherNotes,
      learnerNotes: partial.learnerNotes ? { ...existing.learnerNotes, ...partial.learnerNotes } : existing.learnerNotes,
      activity: partial.activity ? { ...existing.activity, ...partial.activity } : existing.activity,
      quiz: partial.quiz ? { ...existing.quiz, ...partial.quiz } : existing.quiz,
      worksheet: partial.worksheet ? { ...existing.worksheet, ...partial.worksheet } : existing.worksheet,
      slideDeck: partial.slideDeck ? { ...existing.slideDeck, ...partial.slideDeck } : existing.slideDeck,
      videoResources: partial.videoResources ? { ...existing.videoResources, ...partial.videoResources } : existing.videoResources,
      audioPodcast: partial.audioPodcast ? { ...existing.audioPodcast, ...partial.audioPodcast } : existing.audioPodcast,
    };

    this.packages.set(id, updated);
    return updated;
  }

  // Idempotency
  public getIdempotency(key: string): { status: number; body: any; timestamp: number } | undefined {
    return this.idempotencyStore.get(key);
  }

  public setIdempotency(key: string, status: number, body: any): void {
    this.idempotencyStore.set(key, {
      status,
      body,
      timestamp: Date.now(),
    });
  }

  // Video Jobs
  public saveVideoJob(job: VideoJob): VideoJob {
    this.videoJobs.set(job.packageId, job);
    return job;
  }

  public getVideoJob(packageId: string): VideoJob | undefined {
    return this.videoJobs.get(packageId);
  }
}

export const repository = new InMemoryRepository();
