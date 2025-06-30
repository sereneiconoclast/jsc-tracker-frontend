'use client';

import ReactMarkdown from 'react-markdown';
import { ApiError } from '../types/auth';
import { BaseEditable } from './BaseEditable';
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
  const renderInput = (inputValue: string, onChange: (value: string) => void) => (
    <textarea
      value={inputValue}
      onChange={(e) => onChange(e.target.value)}
      className={styles.markdownEditInput}
      rows={6}
    />
  );

  const renderDisplay = (displayValue: string, onEditClick: () => void) => (
    <div className={styles.markdownDisplay}>
      <ReactMarkdown>{displayValue}</ReactMarkdown>
      <span onClick={onEditClick} className={styles.editLink}>(edit)</span>
    </div>
  );

  return (
    <BaseEditable
      value={value}
      onSaveStart={onSaveStart}
      onSaveSuccess={onSaveSuccess}
      onSaveError={onSaveError}
      onCancel={onCancel}
      onEditClick={onEditClick}
      editingTip={editingTip}
      renderInput={renderInput}
      renderDisplay={renderDisplay}
      containerClassName={styles.markdownContainer}
    />
  );
};
