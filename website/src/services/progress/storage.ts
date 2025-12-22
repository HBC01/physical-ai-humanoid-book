/**
 * Progress Storage Service
 * Zustand store with localStorage persistence for tracking student progress
 *
 * Based on ADR-0003: Client-Side State Management for Progress Tracking
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Type definitions
export interface LearningProfile {
  id: string; // Anonymous UUID
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferences: {
    language: 'en' | 'ur';
    theme: 'light' | 'dark';
  };
}

export interface ChapterProgress {
  lastVisited: number; // Timestamp
  scrollPosition: number; // Resume reading position
}

export interface ExerciseAttempt {
  attempts: number;
  completed: boolean;
  lastAttempt: number; // Timestamp
}

export interface ProgressData {
  completedChapters: string[]; // Chapter IDs
  chaptersInProgress: Record<string, ChapterProgress>;
  exerciseAttempts: Record<string, ExerciseAttempt>;
}

export interface StoreMetadata {
  createdAt: number;
  lastUpdated: number;
  version: string; // For schema migrations
}

export interface LearningStore {
  profile: LearningProfile | null;
  progress: ProgressData;
  metadata: StoreMetadata;

  // Actions
  initProfile: (profile: Omit<LearningProfile, 'id'>) => void;
  markChapterComplete: (chapterId: string) => void;
  updateChapterProgress: (chapterId: string, scrollPosition: number) => void;
  recordExerciseAttempt: (exerciseId: string, completed: boolean) => void;
  getRecommendations: () => string[];
  exportData: () => void;
  importData: (data: string) => void;
  clearData: () => void;
}

// Create Zustand store with localStorage persistence
export const useProgressStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      profile: null,
      progress: {
        completedChapters: [],
        chaptersInProgress: {},
        exerciseAttempts: {},
      },
      metadata: {
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        version: '1.0.0',
      },

      initProfile: (profileData) =>
        set({
          profile: {
            ...profileData,
            id: crypto.randomUUID(), // Generate anonymous UUID
          },
          metadata: {
            ...get().metadata,
            lastUpdated: Date.now(),
          },
        }),

      markChapterComplete: (chapterId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedChapters: [...new Set([...state.progress.completedChapters, chapterId])],
          },
          metadata: {
            ...state.metadata,
            lastUpdated: Date.now(),
          },
        })),

      updateChapterProgress: (chapterId, scrollPosition) =>
        set((state) => ({
          progress: {
            ...state.progress,
            chaptersInProgress: {
              ...state.progress.chaptersInProgress,
              [chapterId]: {
                lastVisited: Date.now(),
                scrollPosition,
              },
            },
          },
          metadata: {
            ...state.metadata,
            lastUpdated: Date.now(),
          },
        })),

      recordExerciseAttempt: (exerciseId, completed) =>
        set((state) => {
          const current = state.progress.exerciseAttempts[exerciseId] || {
            attempts: 0,
            completed: false,
            lastAttempt: 0,
          };
          return {
            progress: {
              ...state.progress,
              exerciseAttempts: {
                ...state.progress.exerciseAttempts,
                [exerciseId]: {
                  attempts: current.attempts + 1,
                  completed: completed || current.completed,
                  lastAttempt: Date.now(),
                },
              },
            },
            metadata: {
              ...state.metadata,
              lastUpdated: Date.now(),
            },
          };
        }),

      getRecommendations: () => {
        // TODO: Implement rule-based recommendation engine (Phase 6, T079-T082)
        // Rules: sequential progression, prerequisites, struggle detection, goals, time-away
        return [];
      },

      exportData: () => {
        const state = get();
        const data = JSON.stringify(state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learning-progress-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          // TODO: Add schema validation
          set(parsed);
        } catch (err) {
          console.error('Invalid progress data:', err);
          alert('Failed to import progress data. Invalid format.');
        }
      },

      clearData: () => {
        if (confirm('Delete all progress? This cannot be undone.')) {
          set({
            profile: null,
            progress: {
              completedChapters: [],
              chaptersInProgress: {},
              exerciseAttempts: {},
            },
            metadata: {
              createdAt: Date.now(),
              lastUpdated: Date.now(),
              version: '1.0.0',
            },
          });
        }
      },
    }),
    {
      name: 'learning-progress', // localStorage key
      version: 1, // For migrations
    }
  )
);
