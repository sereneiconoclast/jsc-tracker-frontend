'use client';

import styles from '../app/page.module.css';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
}

export const ErrorDisplay = (p: ErrorDisplayProps) => {
  if (!p.error) return null;

  return (
    <div className={styles.error}>
      Could not edit: {p.error}
      <button
        className={styles.errorClose}
        onClick={p.onDismiss}
      >
        ×
      </button>
    </div>
  );
};
