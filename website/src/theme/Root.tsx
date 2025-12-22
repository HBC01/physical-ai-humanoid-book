/**
 * Root Theme Component
 *
 * Wraps the entire Docusaurus app and adds global components like the AI Assistant.
 */

import React from 'react';
import AIAssistant from '../components/AIAssistant';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();

  // Detect language from URL path
  const language = location.pathname.startsWith('/ur/') ? 'ur' : 'en';

  // Only show floating AI assistant on documentation pages
  const isDocsPage = location.pathname.includes('/docs/');

  return (
    <>
      {children}
      {isDocsPage && <AIAssistant mode="floating" language={language} />}
    </>
  );
}
