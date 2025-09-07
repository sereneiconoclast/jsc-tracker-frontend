import React from 'react';
import { Contact } from './Contact';
import { ContactRecord, ApiError } from '../types/auth';
import styles from './ContactsList.module.css';

interface ContactsListProps {
  contactRecords: ContactRecord[];
  onAddContact: () => void;
  onSaveContactName: (contactId: string, newValue: string) => Promise<void>;
  onSaveContactInfo: (contactId: string, newValue: string) => Promise<void>;
  onSaveContactNotes: (contactId: string, newValue: string) => Promise<void>;
  onSaveContactStatus: (contactId: string, newValue: string) => Promise<void>;
  onArchiveContact: (contactId: string) => Promise<void>;
  onSaveDisplayError: (error: ApiError) => void;
}

export function ContactsList(p: ContactsListProps) {
  return (
    <div className={styles.contactsList}>
      <div className={styles.contactsHeader}>
        <h2>Contacts</h2>
        <button
          className={styles.addContactButton}
          onClick={p.onAddContact}
        >
          Add Contact
        </button>
      </div>

      {p.contactRecords.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No contacts yet. Click &quot;Add Contact&quot; to create your first contact.</p>
        </div>
      ) : (
        <div className={styles.contactsGrid}>
          {p.contactRecords.map((record) => (
            <Contact
              key={record.contact_id}
              record={record}
              onSaveContactName={(newValue) => p.onSaveContactName(record.contact_id, newValue)}
              onSaveContactInfo={(newValue) => p.onSaveContactInfo(record.contact_id, newValue)}
              onSaveContactNotes={(newValue) => p.onSaveContactNotes(record.contact_id, newValue)}
              onSaveContactStatus={(newValue) => p.onSaveContactStatus(record.contact_id, newValue)}
              onArchiveContact={(contactId) => p.onArchiveContact(contactId)}
              onSaveDisplayError={p.onSaveDisplayError}
            />
          ))}
        </div>
      )}
    </div>
  );
}
