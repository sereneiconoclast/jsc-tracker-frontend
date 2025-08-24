'use client';

import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { ApiError } from '../types/auth';
import { useFieldEditor } from '../hooks/useFieldEditor';
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

export const BaseEditable = (p: BaseEditableProps) => {
  const fieldEditor = useFieldEditor({
    value: p.value,
    onSaveStart: p.onSaveStart,
    onSaveSuccess: p.onSaveSuccess,
    onSaveError: p.onSaveError,
    onCancel: p.onCancel,
    onEditClick: p.onEditClick
  });

  const renderEditingTip = () => {
    if (!p.editingTip) return null;

    return (
      <p className={styles.editingTip}>
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a {...props} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        >
          {p.editingTip}
        </ReactMarkdown>
      </p>
    );
  };

  return (
    <div className={p.containerClassName}>
      {fieldEditor.isEditing ? (
        <div className={styles.editContainer}>
          {renderEditingTip()}
          {p.renderInput(fieldEditor.editedValue, fieldEditor.handleInputChange)}
          <span className={styles.editButtons}>
            <button
              onClick={fieldEditor.handleSave}
              disabled={fieldEditor.isSaving}
              className={styles.saveButton}
            >
              {fieldEditor.isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={fieldEditor.handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </span>
        </div>
      ) : (
        p.renderDisplay(p.value, fieldEditor.handleEditClick)
      )}
    </div>
  );
};
