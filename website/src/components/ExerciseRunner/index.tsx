import React, { useState } from 'react';
import styles from './styles.module.css';

interface ExerciseRunnerProps {
  exerciseId: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites?: string[];
}

export default function ExerciseRunner({
  exerciseId,
  title,
  difficulty,
  estimatedTime,
  prerequisites = [],
}: ExerciseRunnerProps): JSX.Element {
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState('');

  const difficultyColor = {
    beginner: '#4caf50',
    intermediate: '#ff9800',
    advanced: '#f44336',
  };

  return (
    <div className={styles.exerciseRunner}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <div className={styles.metadata}>
          <span
            className={styles.difficulty}
            style={{ backgroundColor: difficultyColor[difficulty] }}
          >
            {difficulty}
          </span>
          <span className={styles.time}>⏱️ {estimatedTime}</span>
        </div>
      </div>

      {prerequisites.length > 0 && (
        <div className={styles.prerequisites}>
          <strong>Prerequisites:</strong>
          <ul>
            {prerequisites.map((prereq, index) => (
              <li key={index}>{prereq}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${completed ? styles.completed : ''}`}
          onClick={() => setCompleted(!completed)}
        >
          {completed ? '✓ Completed' : 'Mark as Complete'}
        </button>

        <button
          className={styles.button}
          onClick={() => {
            const progress = JSON.parse(
              localStorage.getItem('exerciseProgress') || '{}'
            );
            progress[exerciseId] = {
              completed,
              notes,
              timestamp: new Date().toISOString(),
            };
            localStorage.setItem('exerciseProgress', JSON.stringify(progress));
            alert('Progress saved!');
          }}
        >
          💾 Save Progress
        </button>
      </div>

      <div className={styles.notes}>
        <label htmlFor="exercise-notes">
          <strong>Your Notes:</strong>
        </label>
        <textarea
          id="exercise-notes"
          className={styles.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes, observations, or challenges here..."
          rows={4}
        />
      </div>

      {completed && (
        <div className={styles.celebration}>
          🎉 Great job completing this exercise!
        </div>
      )}
    </div>
  );
}
