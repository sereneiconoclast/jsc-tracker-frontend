import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ContactRecord } from '../types/auth';
import styles from './Contact.module.css';

interface ContactProps {
  record: ContactRecord;
}

export function Contact(p: ContactProps) {
  return (
    <div className={styles.contact}>
      <div className={styles.contactHeader}>
        <h3 className={styles.contactName}>{p.record.name || 'Unnamed Contact'}</h3>
        <span className={styles.contactId}>{p.record.contact_id}</span>
      </div>

      {p.record.contact_info && (
        <div className={styles.contactSection}>
          <h4>Contact Info</h4>
          <div className={styles.markdownDisplay}>
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {p.record.contact_info}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {p.record.notes && (
        <div className={styles.contactSection}>
          <h4>Notes</h4>
          <div className={styles.notesLink}>
            <a href={p.record.notes} target="_blank" rel="noopener noreferrer">
              {p.record.notes}
            </a>
          </div>
        </div>
      )}

      {p.record.status && (
        <div className={styles.contactSection}>
          <h4>Status</h4>
          <div className={styles.markdownDisplay}>
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {p.record.status}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
