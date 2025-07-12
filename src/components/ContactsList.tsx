import React from 'react';
import { Contact } from './Contact';
import { ContactRecord } from '../types/auth';
import styles from './ContactsList.module.css';

interface ContactsListProps {
  contactRecords: ContactRecord[];
  onAddContact: () => void;
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
          <p>No contacts yet. Click "Add Contact" to create your first contact.</p>
        </div>
      ) : (
        <div className={styles.contactsGrid}>
          {p.contactRecords.map((record) => (
            <Contact key={record.contact_id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}
