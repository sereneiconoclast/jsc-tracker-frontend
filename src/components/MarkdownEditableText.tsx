'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ApiError } from '../types/auth';
import styles from '../app/page.module.css';

interface MarkdownEditableTextProps {
  value: string;
  onSaveStart: (value: string) => Promise<void>;
  onSaveSuccess?: () => void;
  onSaveError: (error: ApiError) => void;
  onCancel?: () => void;
  onEditClick?: () => void;
  editingTip?: string;
}

export const MarkdownEditableText = ({
  value,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
  onCancel,
  onEditClick,
  editingTip
}: MarkdownEditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveStart(editedValue);
      onSaveSuccess?.();
      setIsEditing(false);
    } catch (err) {
      const error = err as ApiError;
      onSaveError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setIsEditing(false);
  };

  const handleEditClick = () => {
    onEditClick?.();
    setIsEditing(true);
  };

  return (
    <div className={styles.markdownContainer}>
      {isEditing ? (
        <div className={styles.editContainer}>
          {editingTip && <p className={styles.editingTip}>{editingTip}</p>}
          <textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className={styles.markdownEditInput}
            rows={6}
          />
          <span className={styles.editButtons}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={styles.saveButton}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </span>
        </div>
      ) : (
        <div className={styles.markdownDisplay}>
          <ReactMarkdown>{value}</ReactMarkdown>
          <span onClick={handleEditClick} className={styles.editLink}>(edit)</span>
        </div>
      )}
    </div>
  );
};
