/**
 * Recommendations Engine
 *
 * Rule-based recommendation system for personalized learning paths.
 */

import type { LearningProfile, ProgressData, ExerciseAttempt } from './storage';

export interface Recommendation {
  type: 'next' | 'review' | 'practice' | 'refresher';
  chapterId: string;
  module: string;
  title: string;
  reason: string;
  priority: number; // 1-5, higher = more important
}

// Module and chapter metadata
const CURRICULUM_STRUCTURE: Record<string, { title: string; chapters: string[]; prerequisites?: string[] }> = {
  '01-foundations': {
    title: 'Foundations of Physical AI',
    chapters: ['chapter-01-intro', 'chapter-02-embodied-intelligence', 'chapter-03-physical-systems'],
    prerequisites: [],
  },
  '02-ros2': {
    title: 'ROS 2 Fundamentals',
    chapters: ['chapter-01-intro', 'chapter-02-nodes-topics', 'chapter-03-services-actions'],
    prerequisites: ['01-foundations'],
  },
  '03-simulation': {
    title: 'Simulation Tools',
    chapters: ['chapter-01-gazebo', 'chapter-02-pybullet', 'chapter-03-isaac-intro'],
    prerequisites: ['02-ros2'],
  },
  '04-isaac': {
    title: 'Isaac Sim Deep Dive',
    chapters: ['chapter-01-setup', 'chapter-02-environments', 'chapter-03-integration'],
    prerequisites: ['03-simulation'],
  },
  '05-vla': {
    title: 'Vision-Language-Action',
    chapters: ['chapter-01-vision', 'chapter-02-language', 'chapter-03-action'],
    prerequisites: ['03-simulation'],
  },
  '06-conversational': {
    title: 'Conversational AI',
    chapters: ['chapter-01-speech', 'chapter-02-nlp', 'chapter-03-integration'],
    prerequisites: ['05-vla'],
  },
  '07-capstone': {
    title: 'Capstone Project',
    chapters: ['chapter-01-design', 'chapter-02-implementation', 'chapter-03-deployment'],
    prerequisites: ['04-isaac', '06-conversational'],
  },
};

/**
 * Generate personalized recommendations based on progress and profile
 */
export function generateRecommendations(
  profile: LearningProfile | null,
  progress: ProgressData
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // 1. Sequential progression (next logical chapter)
  recommendations.push(...getSequentialRecommendations(progress));

  // 2. Struggle detection (>3 exercise attempts without completion)
  recommendations.push(...getStruggleRecommendations(progress));

  // 3. Time-away detection (>7 days since last visit)
  recommendations.push(...getRefresherRecommendations(progress));

  // 4. Goal alignment (based on user goals)
  if (profile) {
    recommendations.push(...getGoalAlignedRecommendations(profile, progress));
  }

  // 5. Prerequisites check
  recommendations.push(...getPrerequisiteRecommendations(progress));

  // Sort by priority (descending)
  recommendations.sort((a, b) => b.priority - a.priority);

  // Return top 5
  return recommendations.slice(0, 5);
}

/**
 * Get next chapter in sequential order
 */
function getSequentialRecommendations(progress: ProgressData): Recommendation[] {
  const { completedChapters } = progress;
  const recommendations: Recommendation[] = [];

  // Find first incomplete chapter in each module
  for (const [moduleId, module] of Object.entries(CURRICULUM_STRUCTURE)) {
    for (const chapterId of module.chapters) {
      const fullChapterId = `${moduleId}/${chapterId}`;

      if (!completedChapters.includes(fullChapterId)) {
        recommendations.push({
          type: 'next',
          chapterId: fullChapterId,
          module: module.title,
          title: formatChapterTitle(chapterId),
          reason: 'Continue your learning journey',
          priority: 5,
        });
        break; // Only recommend first incomplete chapter per module
      }
    }
  }

  return recommendations;
}

/**
 * Detect struggle (>3 exercise attempts) and recommend review
 */
function getStruggleRecommendations(progress: ProgressData): Recommendation[] {
  const { exerciseAttempts } = progress;
  const recommendations: Recommendation[] = [];

  for (const [exerciseId, attempt] of Object.entries(exerciseAttempts)) {
    if (attempt.attempts > 3 && !attempt.completed) {
      // Extract chapter from exercise ID (e.g., "02-ros2/exercise-01" → "02-ros2/chapter-01")
      const moduleMatch = exerciseId.match(/^(\d+-[\w-]+)/);
      if (moduleMatch) {
        const moduleId = moduleMatch[1];
        const module = CURRICULUM_STRUCTURE[moduleId];

        if (module && module.chapters.length > 0) {
          recommendations.push({
            type: 'review',
            chapterId: `${moduleId}/${module.chapters[0]}`,
            module: module.title,
            title: 'Review fundamentals',
            reason: `You've attempted exercise ${exerciseId.split('/').pop()} ${attempt.attempts} times. Review the basics!`,
            priority: 4,
          });
        }
      }
    }
  }

  return recommendations;
}

/**
 * Detect time away (>7 days) and recommend refresher
 */
function getRefresherRecommendations(progress: ProgressData): Recommendation[] {
  const { chaptersInProgress } = progress;
  const recommendations: Recommendation[] = [];
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const [chapterId, chapterProgress] of Object.entries(chaptersInProgress)) {
    if (chapterProgress.lastVisited < sevenDaysAgo) {
      const [moduleId, chapter] = chapterId.split('/');
      const module = CURRICULUM_STRUCTURE[moduleId];

      if (module) {
        recommendations.push({
          type: 'refresher',
          chapterId,
          module: module.title,
          title: formatChapterTitle(chapter),
          reason: 'You started this chapter over a week ago. Resume where you left off!',
          priority: 3,
        });
      }
    }
  }

  return recommendations;
}

/**
 * Recommend chapters aligned with user goals
 */
function getGoalAlignedRecommendations(
  profile: LearningProfile,
  progress: ProgressData
): Recommendation[] {
  const { goals } = profile;
  const { completedChapters } = progress;
  const recommendations: Recommendation[] = [];

  // Map goals to relevant modules
  const goalModuleMap: Record<string, string[]> = {
    'build-robots': ['03-simulation', '04-isaac', '07-capstone'],
    'vision-ai': ['05-vla'],
    'conversational-ai': ['06-conversational'],
    'ros2-expert': ['02-ros2'],
    'research': ['01-foundations', '05-vla', '06-conversational'],
  };

  for (const goal of goals) {
    const relevantModules = goalModuleMap[goal] || [];

    for (const moduleId of relevantModules) {
      const module = CURRICULUM_STRUCTURE[moduleId];
      if (!module) continue;

      // Find first incomplete chapter in this module
      for (const chapterId of module.chapters) {
        const fullChapterId = `${moduleId}/${chapterId}`;

        if (!completedChapters.includes(fullChapterId)) {
          recommendations.push({
            type: 'next',
            chapterId: fullChapterId,
            module: module.title,
            title: formatChapterTitle(chapterId),
            reason: `Aligns with your goal: ${goal}`,
            priority: 4,
          });
          break;
        }
      }
    }
  }

  return recommendations;
}

/**
 * Check prerequisites and recommend if needed
 */
function getPrerequisiteRecommendations(progress: ProgressData): Recommendation[] {
  const { completedChapters, chaptersInProgress } = progress;
  const recommendations: Recommendation[] = [];

  // Check if user is attempting chapters without completing prerequisites
  for (const chapterId of Object.keys(chaptersInProgress)) {
    const [moduleId] = chapterId.split('/');
    const module = CURRICULUM_STRUCTURE[moduleId];

    if (module && module.prerequisites) {
      for (const prereqModuleId of module.prerequisites) {
        const prereqModule = CURRICULUM_STRUCTURE[prereqModuleId];
        if (!prereqModule) continue;

        // Check if all chapters in prerequisite module are completed
        const allPrereqComplete = prereqModule.chapters.every((chapter) =>
          completedChapters.includes(`${prereqModuleId}/${chapter}`)
        );

        if (!allPrereqComplete) {
          // Find first incomplete prerequisite chapter
          for (const chapter of prereqModule.chapters) {
            const fullChapterId = `${prereqModuleId}/${chapter}`;
            if (!completedChapters.includes(fullChapterId)) {
              recommendations.push({
                type: 'review',
                chapterId: fullChapterId,
                module: prereqModule.title,
                title: formatChapterTitle(chapter),
                reason: `Complete this prerequisite before continuing ${module.title}`,
                priority: 5,
              });
              break;
            }
          }
        }
      }
    }
  }

  return recommendations;
}

/**
 * Format chapter ID to readable title
 */
function formatChapterTitle(chapterId: string): string {
  return chapterId
    .replace('chapter-', 'Chapter ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(progress: ProgressData): number {
  const { completedChapters } = progress;

  // Count total chapters
  const totalChapters = Object.values(CURRICULUM_STRUCTURE).reduce(
    (sum, module) => sum + module.chapters.length,
    0
  );

  if (totalChapters === 0) return 0;

  const percentage = (completedChapters.length / totalChapters) * 100;
  return Math.round(percentage);
}

/**
 * Get module completion stats
 */
export function getModuleStats(progress: ProgressData): Record<string, { completed: number; total: number }> {
  const { completedChapters } = progress;
  const stats: Record<string, { completed: number; total: number }> = {};

  for (const [moduleId, module] of Object.entries(CURRICULUM_STRUCTURE)) {
    const completed = module.chapters.filter((chapter) =>
      completedChapters.includes(`${moduleId}/${chapter}`)
    ).length;

    stats[moduleId] = {
      completed,
      total: module.chapters.length,
    };
  }

  return stats;
}
