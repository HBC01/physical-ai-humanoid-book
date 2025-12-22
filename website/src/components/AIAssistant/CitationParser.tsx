import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface CitationParserProps {
  content: string;
  language?: 'en' | 'ur';
}

/**
 * Parse and render citations in AI responses.
 * Citations are in the format: [Chapter Name - Section]
 */
export default function CitationParser({
  content,
  language = 'en',
}: CitationParserProps): JSX.Element {
  // Pattern to match [Citation Text]
  const citationPattern = /\[([^\]]+)\]/g;

  // Split content by citations
  const parts: Array<{ type: 'text' | 'citation'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = citationPattern.exec(content)) !== null) {
    // Add text before citation
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }

    // Add citation
    parts.push({
      type: 'citation',
      content: match[1],
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  // If no citations found, return plain text
  if (parts.length === 0 || (parts.length === 1 && parts[0].type === 'text')) {
    return (
      <div className={styles.responseContent}>
        {content.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  }

  // Render with citations
  return (
    <div className={styles.responseContent}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          // Split by newlines and render paragraphs
          return part.content.split('\n').map((line, lineIndex) => {
            if (!line.trim()) return null;
            return <React.Fragment key={`${index}-${lineIndex}`}>{line} </React.Fragment>;
          });
        } else {
          // Render citation as a link
          return (
            <sup key={index} className={styles.citation}>
              <Link
                to={convertCitationToUrl(part.content)}
                className={styles.citationLink}
                title={language === 'ur' ? 'ذریعہ دیکھیں' : 'View source'}
              >
                [{part.content}]
              </Link>
            </sup>
          );
        }
      })}
    </div>
  );
}

/**
 * Convert citation text to URL
 * Example: "ROS 2 Fundamentals - Nodes and Topics" → "/docs/modules/02-ros2/chapter-02-nodes-topics"
 */
function convertCitationToUrl(citation: string): string {
  // Parse "Chapter Name - Section" format
  const parts = citation.split(' - ');
  if (parts.length < 2) {
    // If format doesn't match, return docs home
    return '/docs/intro';
  }

  const chapterName = parts[0].trim();
  const sectionName = parts[1].trim();

  // Map common chapter names to modules (simplified approach)
  // In production, you'd maintain a proper mapping
  const moduleMap: Record<string, string> = {
    'ROS 2 Fundamentals': '02-ros2',
    'ROS 2': '02-ros2',
    'Simulation Tools': '03-simulation',
    'Isaac Sim': '04-isaac',
    'Vision-Language-Action': '05-vla',
    'VLA': '05-vla',
    'Conversational AI': '06-conversational',
    'Capstone Project': '07-capstone',
  };

  // Find matching module
  let module = '02-ros2'; // default
  for (const [key, value] of Object.entries(moduleMap)) {
    if (chapterName.includes(key)) {
      module = value;
      break;
    }
  }

  // Convert section name to slug
  const sectionSlug = sectionName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  // Construct URL
  return `/docs/modules/${module}/${sectionSlug}`;
}
