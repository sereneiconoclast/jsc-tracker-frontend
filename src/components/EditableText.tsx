'use client';

import { useState } from 'react';
import { ApiError } from '../types/auth';
import styles from '../app/page.module.css';

interface EditableTextProps {
  value: string;
  onSaveStart: (value: string) => Promise<void>;
  onSaveSuccess?: () => void;
  onSaveError: (error: ApiError) => void;
  onCancel?: () => void;
  onEditClick?: () => void;
  isLink?: boolean;
  editingTip?: string;
}

export const EditableText = ({
  value,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
  onCancel,
  onEditClick,
  isLink = false,
  editingTip
}: EditableTextProps) => {
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
    <span>
      {isEditing ? (
        <span className={styles.editContainer}>
          {editingTip && <p className={styles.editingTip}>{editingTip}</p>}
          <input
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className={styles.editInput}
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
        </span>
      ) : (
        <span>
          {isLink ? (
            <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
          ) : (
            value
          )}{' '}
          <span onClick={handleEditClick} className={styles.editLink}>(edit)</span>
        </span>
      )}
    </span>
  );
};
