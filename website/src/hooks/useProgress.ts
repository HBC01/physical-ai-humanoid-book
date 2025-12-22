/**
 * useProgress Hook
 *
 * React hook for progress tracking functionality.
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import { useProgressStore } from '../services/progress/storage';
import { generateRecommendations, getCompletionPercentage, getModuleStats } from '../services/progress/recommendations';
import type { Recommendation } from '../services/progress/recommendations';
import type { LearningProfile } from '../services/progress/storage';

interface UseProgressReturn {
  // Profile
  profile: LearningProfile | null;
  hasProfile: boolean;
  initProfile: (profile: Omit<LearningProfile, 'id'>) => void;

  // Progress tracking
  completedChapters: string[];
  isChapterComplete: (chapterId: string) => boolean;
  markChapterComplete: (chapterId: string) => void;
  updateChapterProgress: (chapterId: string, scrollPosition: number) => void;

  // Exercise tracking
  recordExerciseAttempt: (exerciseId: string, completed: boolean) => void;
  getExerciseAttempts: (exerciseId: string) => number;
  isExerciseComplete: (exerciseId: string) => boolean;

  // Stats and recommendations
  completionPercentage: number;
  moduleStats: Record<string, { completed: number; total: number }>;
  recommendations: Recommendation[];

  // Data management
  exportData: () => void;
  importData: (data: string) => void;
  clearData: () => void;
}

/**
 * Hook for progress tracking
 */
export function useProgress(): UseProgressReturn {
  const location = useLocation();

  const {
    profile,
    progress,
    initProfile,
    markChapterComplete,
    updateChapterProgress,
    recordExerciseAttempt,
    exportData,
    importData,
    clearData,
  } = useProgressStore();

  // Auto-update chapter progress when navigating
  useEffect(() => {
    // Extract chapter ID from URL (e.g., /docs/modules/02-ros2/chapter-01-intro)
    const match = location.pathname.match(/\/docs\/modules\/([\w-]+)\/([\w-]+)/);
    if (match) {
      const [, moduleId, chapterId] = match;
      const fullChapterId = `${moduleId}/${chapterId}`;

      // Update last visited timestamp
      updateChapterProgress(fullChapterId, 0);
    }
  }, [location.pathname, updateChapterProgress]);

  // Auto-save scroll position
  useEffect(() => {
    const saveScrollPosition = () => {
      const match = location.pathname.match(/\/docs\/modules\/([\w-]+)\/([\w-]+)/);
      if (match) {
        const [, moduleId, chapterId] = match;
        const fullChapterId = `${moduleId}/${chapterId}`;
        const scrollPosition = window.scrollY;

        updateChapterProgress(fullChapterId, scrollPosition);
      }
    };

    // Throttle scroll events
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScrollPosition, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [location.pathname, updateChapterProgress]);

  const isChapterComplete = useCallback(
    (chapterId: string): boolean => {
      return progress.completedChapters.includes(chapterId);
    },
    [progress.completedChapters]
  );

  const getExerciseAttempts = useCallback(
    (exerciseId: string): number => {
      return progress.exerciseAttempts[exerciseId]?.attempts || 0;
    },
    [progress.exerciseAttempts]
  );

  const isExerciseComplete = useCallback(
    (exerciseId: string): boolean => {
      return progress.exerciseAttempts[exerciseId]?.completed || false;
    },
    [progress.exerciseAttempts]
  );

  // Calculate stats and recommendations
  const completionPercentage = getCompletionPercentage(progress);
  const moduleStats = getModuleStats(progress);
  const recommendations = generateRecommendations(profile, progress);

  return {
    // Profile
    profile,
    hasProfile: profile !== null,
    initProfile,

    // Progress tracking
    completedChapters: progress.completedChapters,
    isChapterComplete,
    markChapterComplete,
    updateChapterProgress,

    // Exercise tracking
    recordExerciseAttempt,
    getExerciseAttempts,
    isExerciseComplete,

    // Stats and recommendations
    completionPercentage,
    moduleStats,
    recommendations,

    // Data management
    exportData,
    importData,
    clearData,
  };
}
