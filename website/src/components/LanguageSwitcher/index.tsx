/**
 * Language Switcher Component
 *
 * Allows users to switch between English and Urdu.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

export default function LanguageSwitcher(): JSX.Element {
  const { i18n } = useDocusaurusContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = i18n.currentLocale;
  const locales = i18n.locales;

  // Get locale configuration
  const localeConfigs = {
    en: { label: 'English', flag: '🇬🇧', dir: 'ltr' },
    ur: { label: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  };

  const currentConfig = localeConfigs[currentLocale] || localeConfigs.en;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isOpen]);

  const switchLanguage = (locale: string) => {
    // Store language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', locale);
    }

    // Build new URL with locale
    const baseUrl = i18n.defaultLocale === locale ? '/' : `/${locale}/`;
    const path = location.pathname.replace(/^\/(en|ur)\//, '/');
    window.location.href = `${baseUrl}${path.slice(1)}`;
  };

  // Restore language preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preferred = localStorage.getItem('preferredLanguage');
      if (preferred && preferred !== currentLocale && locales.includes(preferred)) {
        switchLanguage(preferred);
      }
    }
  }, []);

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={styles.switcherButton}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label="Switch language"
      >
        <span className={styles.flag}>{currentConfig.flag}</span>
        <span className={styles.label}>{currentConfig.label}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {locales
            .filter((locale) => locale !== currentLocale)
            .map((locale) => {
              const config = localeConfigs[locale];
              return (
                <button
                  key={locale}
                  className={styles.dropdownItem}
                  onClick={() => switchLanguage(locale)}
                >
                  <span className={styles.flag}>{config.flag}</span>
                  <span className={styles.label}>{config.label}</span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
