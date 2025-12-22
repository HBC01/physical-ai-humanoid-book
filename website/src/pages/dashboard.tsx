import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useProgress } from '../hooks/useProgress';
import { Dashboard, ProfileSetup } from '../components/ProgressTracker';

export default function DashboardPage(): JSX.Element {
  const { hasProfile } = useProgress();
  const [showSetup, setShowSetup] = useState(!hasProfile);

  return (
    <Layout
      title="Learning Dashboard"
      description="Track your learning progress through the Physical AI & Humanoid Robotics textbook"
    >
      {showSetup && !hasProfile ? (
        <ProfileSetup onComplete={() => setShowSetup(false)} />
      ) : (
        <Dashboard />
      )}
    </Layout>
  );
}
