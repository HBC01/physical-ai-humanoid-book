import React from 'react';
import Link from '@docusaurus/Link';
import { useProgress } from '../../hooks/useProgress';
import styles from './styles.module.css';

interface DashboardProps {
  language?: 'en' | 'ur';
}

export default function Dashboard({ language = 'en' }: DashboardProps): JSX.Element {
  const {
    profile,
    completionPercentage,
    moduleStats,
    recommendations,
    completedChapters,
  } = useProgress();

  const texts = {
    en: {
      title: 'Learning Dashboard',
      overallProgress: 'Overall Progress',
      modulesCompleted: 'Modules Progress',
      recommendations: 'Recommended Next Steps',
      recentActivity: 'Recent Activity',
      noActivity: 'No activity yet. Start learning!',
      chaptersCompleted: 'Chapters Completed',
    },
    ur: {
      title: 'سیکھنے کا ڈیش بورڈ',
      overallProgress: 'مجموعی پیش رفت',
      modulesCompleted: 'ماڈیولز کی پیش رفت',
      recommendations: 'اگلے اقدامات کی تجویز',
      recentActivity: 'حالیہ سرگرمی',
      noActivity: 'ابھی تک کوئی سرگرمی نہیں۔ سیکھنا شروع کریں!',
      chaptersCompleted: 'مکمل شدہ ابواب',
    },
  };

  const t = texts[language];

  // Format module names
  const MODULE_NAMES: Record<string, { en: string; ur: string }> = {
    '01-foundations': { en: 'Foundations', ur: 'بنیادی باتیں' },
    '02-ros2': { en: 'ROS 2 Fundamentals', ur: 'ROS 2 بنیادی باتیں' },
    '03-simulation': { en: 'Simulation Tools', ur: 'سمولیشن ٹولز' },
    '04-isaac': { en: 'Isaac Sim', ur: 'Isaac Sim' },
    '05-vla': { en: 'Vision-Language-Action', ur: 'وژن-لینگویج-ایکشن' },
    '06-conversational': { en: 'Conversational AI', ur: 'بات چیت کی AI' },
    '07-capstone': { en: 'Capstone Project', ur: 'کیپسٹون پروجیکٹ' },
  };

  return (
    <div className={styles.dashboard} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1>{t.title}</h1>
        {profile && (
          <div className={styles.profileBadge}>
            <span className={styles.profileIcon}>👤</span>
            <span className={styles.profileLevel}>{profile.experienceLevel}</span>
          </div>
        )}
      </div>

      {/* Overall Progress */}
      <div className={styles.progressCard}>
        <h2>{t.overallProgress}</h2>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${completionPercentage}%` }} />
        </div>
        <div className={styles.progressText}>
          {completionPercentage}% • {completedChapters.length} {t.chaptersCompleted}
        </div>
      </div>

      {/* Module Stats */}
      <div className={styles.moduleStatsCard}>
        <h2>{t.modulesCompleted}</h2>
        <div className={styles.moduleGrid}>
          {Object.entries(moduleStats).map(([moduleId, stats]) => {
            const percentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
            const moduleName = MODULE_NAMES[moduleId]?.[language] || moduleId;

            return (
              <div key={moduleId} className={styles.moduleItem}>
                <div className={styles.moduleHeader}>
                  <span className={styles.moduleName}>{moduleName}</span>
                  <span className={styles.moduleCount}>
                    {stats.completed}/{stats.total}
                  </span>
                </div>
                <div className={styles.moduleProgressBar}>
                  <div
                    className={styles.moduleProgressFill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className={styles.recommendationsCard}>
          <h2>{t.recommendations}</h2>
          <div className={styles.recommendationsList}>
            {recommendations.map((rec, index) => {
              const typeIcons = {
                next: '➡️',
                review: '🔄',
                practice: '💪',
                refresher: '⏰',
              };

              const typeColors = {
                next: 'var(--ifm-color-primary)',
                review: 'var(--ifm-color-warning)',
                practice: 'var(--ifm-color-success)',
                refresher: 'var(--ifm-color-info)',
              };

              return (
                <Link
                  key={index}
                  to={`/docs/modules/${rec.chapterId}`}
                  className={styles.recommendationItem}
                >
                  <div className={styles.recommendationIcon}>
                    {typeIcons[rec.type]}
                  </div>
                  <div className={styles.recommendationContent}>
                    <div className={styles.recommendationTitle}>{rec.title}</div>
                    <div className={styles.recommendationModule}>{rec.module}</div>
                    <div className={styles.recommendationReason}>{rec.reason}</div>
                  </div>
                  <div
                    className={styles.recommendationPriority}
                    style={{ backgroundColor: typeColors[rec.type] }}
                  >
                    {rec.priority}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
