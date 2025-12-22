import React from 'react';
import { useProgress } from '../../hooks/useProgress';
import styles from './styles.module.css';

interface ExerciseProgressProps {
  exerciseId: string;
  language?: 'en' | 'ur';
}

export default function ExerciseProgress({
  exerciseId,
  language = 'en',
}: ExerciseProgressProps): JSX.Element {
  const { getExerciseAttempts, isExerciseComplete, recordExerciseAttempt } = useProgress();

  const attempts = getExerciseAttempts(exerciseId);
  const isComplete = isExerciseComplete(exerciseId);

  const texts = {
    en: {
      attempts: 'Attempts',
      recordAttempt: 'Record Attempt',
      markComplete: 'Mark Complete',
      completed: 'Completed ✓',
      struggling: 'Need help? Try reviewing the chapter.',
    },
    ur: {
      attempts: 'کوششیں',
      recordAttempt: 'کوشش ریکارڈ کریں',
      markComplete: 'مکمل کریں',
      completed: 'مکمل ✓',
      struggling: 'مدد کی ضرورت ہے؟ باب کا جائزہ لینے کی کوشش کریں۔',
    },
  };

  const t = texts[language];

  const handleRecordAttempt = () => {
    recordExerciseAttempt(exerciseId, false);
  };

  const handleMarkComplete = () => {
    recordExerciseAttempt(exerciseId, true);
  };

  const isStruggling = attempts > 3 && !isComplete;

  return (
    <div className={styles.exerciseProgress} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className={styles.exerciseStats}>
        <span className={styles.attemptCount}>
          {t.attempts}: {attempts}
        </span>
        {isComplete && <span className={styles.completeBadge}>{t.completed}</span>}
      </div>

      {isStruggling && (
        <div className={styles.strugglingMessage}>{t.struggling}</div>
      )}

      <div className={styles.exerciseActions}>
        {!isComplete && (
          <>
            <button onClick={handleRecordAttempt} className={styles.attemptButton}>
              {t.recordAttempt}
            </button>
            <button onClick={handleMarkComplete} className={styles.completeButton}>
              {t.markComplete}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
