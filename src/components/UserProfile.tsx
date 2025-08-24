'use client';

import { formatDistanceToNow } from 'date-fns';
import { UserRecord, ApiError } from '../types/auth';
import { EditableText } from './EditableText';
import { MarkdownEditableText } from './MarkdownEditableText';
import styles from '../app/page.module.css';

interface UserProfileProps {
  userRecord: UserRecord;
  onSaveUserNameStart: (newName: string) => Promise<void>;
  onSaveUserEmailStart: (newEmail: string) => Promise<void>;
  onSaveSlackProfileStart: (newProfile: string) => Promise<void>;
  onSaveTwoPagerStart: (newTwoPager: string) => Promise<void>;
  onSaveCMFStart: (newCMF: string) => Promise<void>;
  onSaveContactInfoStart: (newContactInfo: string) => Promise<void>;
  onSaveDisplayError: (error: ApiError) => void;
}

export const UserProfile = (p: UserProfileProps) => {
  return (
    <div className={styles.userProfile}>
      <div className={styles.userHeader}>
        {p.userRecord.picture_data ? (
          <img
            src={`data:image/jpeg;base64,${p.userRecord.picture_data}`}
            alt={`${p.userRecord.name}'s profile picture`}
            width={64}
            height={64}
            className={styles.profilePicture}
          />
        ) : (
          <div className={styles.profilePicturePlaceholder}>
            {p.userRecord.name.charAt(0)}
          </div>
        )}
        <div className={styles.userInfo}>
          <EditableText
            value={p.userRecord.name}
            onSaveStart={p.onSaveUserNameStart}
            onSaveError={p.onSaveDisplayError}
          />
          <EditableText
            value={p.userRecord.email}
            onSaveStart={p.onSaveUserEmailStart}
            onSaveError={p.onSaveDisplayError}
          />
          <div>Slack profile URL:{' '}
          <EditableText
            value={p.userRecord.slack_profile}
            editingTip={"Open your Slack profile, click three dots, then \"Copy link to profile\""}
            onSaveStart={p.onSaveSlackProfileStart}
            onSaveError={p.onSaveDisplayError}
            isLink={true}
          /></div>
          <div className={styles.userTimestamps}>
            <p>Joined {formatDistanceToNow(new Date(p.userRecord.created_at * 1000))} ago</p>
            <p>Last seen {formatDistanceToNow(new Date(p.userRecord.modified_at * 1000))} ago</p>
          </div>
          <div>Two-pager URL:{' '}
          <EditableText
            value={p.userRecord.twopager}
            editingTip={"Link to two-pager document"}
            onSaveStart={p.onSaveTwoPagerStart}
            onSaveError={p.onSaveDisplayError}
            isLink={true}
          /></div>
          <div className={styles.cmfSection}>
            <h3>Candidate Market Fit</h3>
            <MarkdownEditableText
              value={p.userRecord.cmf}
              editingTip={"Describe your candidate market fit."}
              onSaveStart={p.onSaveCMFStart}
              onSaveError={p.onSaveDisplayError}
            />
          </div>
          <div className={styles.contactInfoSection}>
            <h3>Contact Information</h3>
            <MarkdownEditableText
              value={p.userRecord.contact_info}
              editingTip={"Add your contact information."}
              onSaveStart={p.onSaveContactInfoStart}
              onSaveError={p.onSaveDisplayError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
