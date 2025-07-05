'use client';

import { ApiError } from '../types/auth';
import { BaseEditable } from './BaseEditable';
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

export const EditableText = (p: EditableTextProps) => {
  const renderInput = (inputValue: string, onChange: (value: string) => void) => (
    <input
      value={inputValue}
      onChange={(e) => onChange(e.target.value)}
      className={styles.editInput}
    />
  );

  const renderDisplay = (displayValue: string, onEditClick: () => void) => (
    <span>
      {p.isLink ? (
        <a href={displayValue} target="_blank" rel="noopener noreferrer">{displayValue}</a>
      ) : (
        displayValue
      )}{' '}
      <span onClick={onEditClick} className={styles.editLink}>(edit)</span>
    </span>
  );

  return (
    <BaseEditable
      value={p.value}
      onSaveStart={p.onSaveStart}
      onSaveSuccess={p.onSaveSuccess}
      onSaveError={p.onSaveError}
      onCancel={p.onCancel}
      onEditClick={p.onEditClick}
      editingTip={p.editingTip}
      renderInput={renderInput}
      renderDisplay={renderDisplay}
    />
  );
};
