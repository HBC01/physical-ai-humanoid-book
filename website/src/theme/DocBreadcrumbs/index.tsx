import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function DocBreadcrumbs(): JSX.Element | null {
  const {metadata} = useDoc();
  const {
    frontMatter,
    title,
    permalink,
  } = metadata;

  // Build breadcrumb trail
  const breadcrumbs = [];

  // Home
  breadcrumbs.push({
    label: 'Home',
    href: '/',
  });

  // Docs
  breadcrumbs.push({
    label: 'Documentation',
    href: '/docs/intro',
  });

  // Parse module from permalink
  const match = permalink.match(/\/docs\/modules\/(\w+)\//);
  if (match) {
    const module = match[1];
    const moduleNames: Record<string, string> = {
      'foundations': 'Module 1: Foundations',
      '01-foundations': 'Module 1: Foundations',
      'ros2': 'Module 2: ROS 2',
      '02-ros2': 'Module 2: ROS 2',
      'simulation': 'Module 3: Simulation',
      '03-simulation': 'Module 3: Simulation',
      'isaac': 'Module 4: NVIDIA Isaac',
      '04-isaac': 'Module 4: NVIDIA Isaac',
      'vla': 'Module 5: Vision-Language-Action',
      '05-vla': 'Module 5: Vision-Language-Action',
      'conversational': 'Module 6: Conversational Robotics',
      '06-conversational': 'Module 6: Conversational Robotics',
      'capstone': 'Module 7: Capstone Project',
      '07-capstone': 'Module 7: Capstone Project',
    };

    if (moduleNames[module]) {
      breadcrumbs.push({
        label: moduleNames[module],
        href: permalink.split('/chapter')[0] + '/',
      });
    }
  }

  // Current page
  breadcrumbs.push({
    label: frontMatter.sidebar_label || title,
    href: permalink,
    active: true,
  });

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {breadcrumbs.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {item.active ? (
              <span className={styles.breadcrumbActive}>{item.label}</span>
            ) : (
              <>
                <Link to={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className={styles.breadcrumbSeparator}> / </span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
