import React, { useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import styles from './styles.module.css';

interface ProfileSetupProps {
  onComplete?: () => void;
  language?: 'en' | 'ur';
}

export default function ProfileSetup({ onComplete, language = 'en' }: ProfileSetupProps): JSX.Element {
  const { initProfile } = useProgress();

  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [goals, setGoals] = useState<string[]>([]);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'ur'>(language);

  const texts = {
    en: {
      title: 'Setup Your Learning Profile',
      subtitle: 'Tell us about your background and goals',
      experienceLabel: 'Experience Level',
      beginner: 'Beginner - New to robotics and AI',
      intermediate: 'Intermediate - Some experience with programming',
      advanced: 'Advanced - Experienced developer or researcher',
      goalsLabel: 'Learning Goals (select all that apply)',
      buildRobots: 'Build and control physical robots',
      visionAI: 'Develop vision AI systems',
      conversationalAI: 'Create conversational AI agents',
      ros2Expert: 'Become a ROS 2 expert',
      research: 'Conduct research in Physical AI',
      languageLabel: 'Preferred Language',
      english: 'English',
      urdu: 'Urdu (اردو)',
      submitButton: 'Start Learning',
      requireGoal: 'Please select at least one learning goal',
    },
    ur: {
      title: 'اپنی سیکھنے کی پروفائل ترتیب دیں',
      subtitle: 'اپنے پس منظر اور اہداف کے بارے میں بتائیں',
      experienceLabel: 'تجربے کی سطح',
      beginner: 'ابتدائی - روبوٹکس اور AI میں نئے',
      intermediate: 'درمیانی - پروگرامنگ میں کچھ تجربہ',
      advanced: 'جدید - تجربہ کار ڈویلپر یا محقق',
      goalsLabel: 'سیکھنے کے اہداف (تمام منتخب کریں جو لاگو ہوں)',
      buildRobots: 'فزیکل روبوٹ بنائیں اور کنٹرول کریں',
      visionAI: 'وژن AI سسٹم بنائیں',
      conversationalAI: 'بات چیت کی AI ایجنٹ بنائیں',
      ros2Expert: 'ROS 2 ماہر بنیں',
      research: 'Physical AI میں تحقیق کریں',
      languageLabel: 'ترجیحی زبان',
      english: 'انگریزی',
      urdu: 'اردو',
      submitButton: 'سیکھنا شروع کریں',
      requireGoal: 'براہ کرم کم از کم ایک سیکھنے کا ہدف منتخب کریں',
    },
  };

  const t = texts[language];

  const handleGoalToggle = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (goals.length === 0) {
      alert(t.requireGoal);
      return;
    }

    initProfile({
      experienceLevel,
      goals,
      preferences: {
        language: preferredLanguage,
        theme: 'light',
      },
    });

    onComplete?.();
  };

  return (
    <div className={styles.profileSetup} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className={styles.setupCard}>
        <h2>{t.title}</h2>
        <p className={styles.setupSubtitle}>{t.subtitle}</p>

        <form onSubmit={handleSubmit}>
          {/* Experience Level */}
          <div className={styles.formSection}>
            <label className={styles.formLabel}>{t.experienceLabel}</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="beginner"
                  checked={experienceLevel === 'beginner'}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                />
                <span>{t.beginner}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="intermediate"
                  checked={experienceLevel === 'intermediate'}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                />
                <span>{t.intermediate}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="advanced"
                  checked={experienceLevel === 'advanced'}
                  onChange={(e) => setExperienceLevel(e.target.value as any)}
                />
                <span>{t.advanced}</span>
              </label>
            </div>
          </div>

          {/* Learning Goals */}
          <div className={styles.formSection}>
            <label className={styles.formLabel}>{t.goalsLabel}</label>
            <div className={styles.checkboxGroup}>
              {[
                { value: 'build-robots', label: t.buildRobots },
                { value: 'vision-ai', label: t.visionAI },
                { value: 'conversational-ai', label: t.conversationalAI },
                { value: 'ros2-expert', label: t.ros2Expert },
                { value: 'research', label: t.research },
              ].map(({ value, label }) => (
                <label key={value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={goals.includes(value)}
                    onChange={() => handleGoalToggle(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language Preference */}
          <div className={styles.formSection}>
            <label className={styles.formLabel}>{t.languageLabel}</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="en"
                  checked={preferredLanguage === 'en'}
                  onChange={(e) => setPreferredLanguage(e.target.value as any)}
                />
                <span>{t.english}</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="ur"
                  checked={preferredLanguage === 'ur'}
                  onChange={(e) => setPreferredLanguage(e.target.value as any)}
                />
                <span>{t.urdu}</span>
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            {t.submitButton}
          </button>
        </form>
      </div>
    </div>
  );
}
