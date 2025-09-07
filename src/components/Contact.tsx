import React from 'react';
import { ContactRecord, ApiError } from '../types/auth';
import { EditableText } from './EditableText';
import { MarkdownEditableText } from './MarkdownEditableText';
import styles from './Contact.module.css';

interface ContactProps {
  record: ContactRecord;
  onSaveContactName: (newValue: string) => Promise<void>;
  onSaveContactInfo: (newValue: string) => Promise<void>;
  onSaveContactNotes: (newValue: string) => Promise<void>;
  onSaveContactStatus: (newValue: string) => Promise<void>;
  onArchiveContact: (contactId: string) => Promise<void>;
  onSaveDisplayError: (error: ApiError) => void;
}

export function Contact(p: ContactProps) {
  return (
    <div className={styles.contact}>
      <div className={styles.contactHeader}>
        <h3 className={styles.contactName}>
          <EditableText
            value={p.record.name}
            onSaveStart={p.onSaveContactName}
            onSaveError={p.onSaveDisplayError}
            editingTip="Click to edit contact name"
          />
        </h3>
        <div className={styles.contactIdContainer}>
          <span className={styles.contactId}>{p.record.contact_id}</span>
          <button
            className={styles.archiveLink}
            onClick={() => p.onArchiveContact(p.record.contact_id)}
            title="Archive this contact"
          >
            (archive)
          </button>
        </div>
      </div>

      <div className={styles.contactSection}>
        <h4>Contact Info</h4>
        <MarkdownEditableText
          value={p.record.contact_info}
          onSaveStart={p.onSaveContactInfo}
          onSaveError={p.onSaveDisplayError}
          editingTip="Click to edit contact info"
        />
      </div>

      <div className={styles.contactSection}>
        <h4>Notes</h4>
        <EditableText
          value={p.record.notes}
          onSaveStart={p.onSaveContactNotes}
          onSaveError={p.onSaveDisplayError}
          editingTip="Click to edit notes URL"
          isLink={true}
        />
      </div>

      <div className={styles.contactSection}>
        <h4>Status</h4>
        <MarkdownEditableText
          value={p.record.status}
          onSaveStart={p.onSaveContactStatus}
          onSaveError={p.onSaveDisplayError}
          editingTip="Click to edit status"
        />
      </div>
    </div>
  );
}
