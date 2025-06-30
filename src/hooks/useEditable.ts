import { useState } from 'react';
import { ApiError } from '../types/auth';

interface UseEditableProps {
  value: string;
  onSaveStart: (value: string) => Promise<void>;
  onSaveSuccess?: () => void;
  onSaveError: (error: ApiError) => void;
  onCancel?: () => void;
  onEditClick?: () => void;
}

export const useEditable = ({
  value,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
  onCancel,
  onEditClick
}: UseEditableProps) => {
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
    setEditedValue(value); // Reset to original value
  };

  const handleEditClick = () => {
    onEditClick?.();
    setIsEditing(true);
    setEditedValue(value); // Ensure we start with current value
  };

  const handleInputChange = (newValue: string) => {
    setEditedValue(newValue);
  };

  return {
    isEditing,
    isSaving,
    editedValue,
    handleSave,
    handleCancel,
    handleEditClick,
    handleInputChange
  };
};
