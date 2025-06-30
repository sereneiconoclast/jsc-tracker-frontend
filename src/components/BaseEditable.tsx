'use client';

import { ReactNode } from 'react';
import { ApiError } from '../types/auth';
import { useEditable } from '../hooks/useEditable';
import styles from '../app/page.module.css';

interface BaseEditableProps {
  value: string;
  onSaveStart: (value: string) => Promise<void>;
  onSaveSuccess?: () => void;
  onSaveError: (error: ApiError) => void;
  onCancel?: () => void;
  onEditClick?: () => void;
  editingTip?: string;
  renderInput: (value: string, onChange: (value: string) => void) => ReactNode;
  renderDisplay: (value: string, onEditClick: () => void) => ReactNode;
  containerClassName?: string;
}

export const BaseEditable = ({
  value,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
  onCancel,
  onEditClick,
  editingTip,
  renderInput,
  renderDisplay,
  containerClassName
}: BaseEditableProps) => {
  const {
    isEditing,
    isSaving,
    editedValue,
    handleSave,
    handleCancel,
    handleEditClick,
    handleInputChange
  } = useEditable({
    value,
    onSaveStart,
    onSaveSuccess,
    onSaveError,
    onCancel,
    onEditClick
  });

  return (
    <div className={containerClassName}>
      {isEditing ? (
        <div className={styles.editContainer}>
          {editingTip && <p className={styles.editingTip}>{editingTip}</p>}
          {renderInput(editedValue, handleInputChange)}
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
        renderDisplay(value, handleEditClick)
      )}
    </div>
  );
};
