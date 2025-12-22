import React from 'react';
import { useProgress } from '../../hooks/useProgress';
import styles from './styles.module.css';

interface ChapterProgressProps {
  chapterId: string;
  chapterTitle: string;
  language?: 'en' | 'ur';
}

export default function ChapterProgress({
  chapterId,
  chapterTitle,
  language = 'en',
}: ChapterProgressProps): JSX.Element {
  const { isChapterComplete, markChapterComplete } = useProgress();

  const isComplete = isChapterComplete(chapterId);

  const texts = {
    en: {
      markComplete: 'Mark as Complete',
      completed: 'Completed ✓',
    },
    ur: {
      markComplete: 'مکمل کے طور پر نشان زد کریں',
      completed: 'مکمل ✓',
    },
  };

  const t = texts[language];

  const handleToggle = () => {
    if (!isComplete) {
      markChapterComplete(chapterId);
    }
  };

  return (
    <div className={styles.chapterProgress} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <button
        onClick={handleToggle}
        className={`${styles.completeButton} ${isComplete ? styles.completed : ''}`}
        disabled={isComplete}
      >
        {isComplete ? t.completed : t.markComplete}
      </button>
    </div>
  );
}
