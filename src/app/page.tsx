'use client';

import Image from "next/image";
import styles from "./page.module.css";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { setAuthCookie, getAuthCookie } from '../utils/cookies';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AuthState, UserData, ApiError } from '../types/auth';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [rawData, setRawData] = useState<string>('(Please wait)');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookie = getAuthCookie();
    setAuth(cookie);
  }, []);

  useEffect(() => {
    if (auth?.access_token) {
      axios.get(`https://jsc-tracker.infinitequack.net/user/-?access_token=${auth.access_token}`)
        .then(response => {
          setUserData(response.data.users[0]);
          setRawData(JSON.stringify(response.data, null, 2));
        })
        .catch(error => {
          setRawData(`Error: ${error.message}`);
        });
    }
  }, [auth]);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setAuthCookie(access_token);
      const cookie = getAuthCookie(); // immediately retrieve and update
      setAuth(cookie);
    },
  });

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

  const onSaveDisplayError = (error: ApiError) => {
    setError(error.response?.data?.error || error.message || 'Failed to save changes');
  };

  const onSaveUserNameStart = async (newName: string) => {
    if (!userData || !auth) return;
    await axios.post(
      `https://jsc-tracker.infinitequack.net/user/${userData.sub}?access_token=${auth.access_token}`,
      { name: newName }
    );
    setUserData({ ...userData, name: newName });
  };

  const onSaveUserEmailStart = async (newEmail: string) => {
    if (!userData || !auth) return;
    await axios.post(
      `https://jsc-tracker.infinitequack.net/user/${userData.sub}?access_token=${auth.access_token}`,
      { email: newEmail }
    );
    setUserData({ ...userData, email: newEmail });
  };

  const onSaveSlackProfileStart = async (newProfile: string) => {
    if (!userData || !auth) return;
    await axios.post(
      `https://jsc-tracker.infinitequack.net/user/${userData.sub}?access_token=${auth.access_token}`,
      { slack_profile: newProfile }
    );
    setUserData({ ...userData, slack_profile: newProfile });
  };

  const onSaveTwoPagerStart = async (newTwoPager: string) => {
    if (!userData || !auth) return;
    await axios.post(
      `https://jsc-tracker.infinitequack.net/user/${userData.sub}?access_token=${auth.access_token}`,
      { twopager: newTwoPager }
    );
    setUserData({ ...userData, twopager: newTwoPager });
  };

  const onSaveCMFStart = async (newCMF: string) => {
    if (!userData || !auth) return;
    await axios.post(
      `https://jsc-tracker.infinitequack.net/user/${userData.sub}?access_token=${auth.access_token}`,
      { cmf: newCMF }
    );
    setUserData({ ...userData, cmf: newCMF });
  };

  const EditableText = ({ value, onSaveStart, onSaveSuccess, onSaveError, onCancel, onEditClick, isLink = false, editingTip }: EditableTextProps) => {
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
    };

    const handleEditClick = () => {
      onEditClick?.();
      setIsEditing(true);
    };

    return (
      <span>
        {isEditing ? (
          <span className={styles.editContainer}>
            {editingTip && <p className={styles.editingTip}>{editingTip}</p>}
            <input
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className={styles.editInput}
            />
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
          </span>
        ) : (
          <span>
            {isLink ? (
              <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
            ) : (
              value
            )}{' '}
            <span onClick={handleEditClick} className={styles.editLink}>(edit)</span>
          </span>
        )}
      </span>
    );
  };

  interface MarkdownEditableTextProps {
    value: string;
    onSaveStart: (value: string) => Promise<void>;
    onSaveSuccess?: () => void;
    onSaveError: (error: ApiError) => void;
    onCancel?: () => void;
    onEditClick?: () => void;
    editingTip?: string;
  }

  const MarkdownEditableText = ({ value, onSaveStart, onSaveSuccess, onSaveError, onCancel, onEditClick, editingTip }: MarkdownEditableTextProps) => {
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
    };

    const handleEditClick = () => {
      onEditClick?.();
      setIsEditing(true);
    };

    return (
      <div className={styles.markdownContainer}>
        {isEditing ? (
          <div className={styles.editContainer}>
            {editingTip && <p className={styles.editingTip}>{editingTip}</p>}
            <textarea
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className={styles.markdownEditInput}
              rows={6}
            />
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
          <div className={styles.markdownDisplay}>
            <ReactMarkdown>{value}</ReactMarkdown>
            <span onClick={handleEditClick} className={styles.editLink}>(edit)</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!auth ? (
          <>
            <button onClick={() => googleLogin()}>Login</button>
            <Image
              className={styles.logo}
              src="/JSC-Tracker/images/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
              unoptimized
            />
          </>
        ) : userData ? (
          <div className={styles.userProfile}>
            {error && (
              <div className={styles.error}>
                Could not edit: {error}
                <button
                  className={styles.errorClose}
                  onClick={() => setError(null)}
                >
                  ×
                </button>
              </div>
            )}
            <div className={styles.userHeader}>
              {userData.picture_data ? (
                <img
                  src={`data:image/jpeg;base64,${userData.picture_data}`}
                  alt={`${userData.name}'s profile picture`}
                  width={64}
                  height={64}
                  className={styles.profilePicture}
                />
              ) : (
                <div className={styles.profilePicturePlaceholder}>
                  {userData.name.charAt(0)}
                </div>
              )}
              <div className={styles.userInfo}>
                <EditableText
                  value={userData.name}
                  onSaveStart={onSaveUserNameStart}
                  onSaveError={onSaveDisplayError}
                />
                <EditableText
                  value={userData.email}
                  onSaveStart={onSaveUserEmailStart}
                  onSaveError={onSaveDisplayError}
                />
                <p>Slack profile URL:{' '}
                <EditableText
                  value={userData.slack_profile}
                  editingTip={"Open your Slack profile, click three dots, then \"Copy link to profile\""}
                  onSaveStart={onSaveSlackProfileStart}
                  onSaveError={onSaveDisplayError}
                  isLink={true}
                /></p>
                <div className={styles.userTimestamps}>
                  <p>Joined {formatDistanceToNow(new Date(userData.created_at * 1000))} ago</p>
                  <p>Last seen {formatDistanceToNow(new Date(userData.modified_at * 1000))} ago</p>
                </div>
                <p>Two-pager URL:{' '}
                <EditableText
                  value={userData.twopager}
                  editingTip={"Link to two-pager document"}
                  onSaveStart={onSaveTwoPagerStart}
                  onSaveError={onSaveDisplayError}
                  isLink={true}
                /></p>
                <div className={styles.cmfSection}>
                  <h3>Candidate Market Fit</h3>
                  <MarkdownEditableText
                    value={userData.cmf}
                    editingTip={"Describe your candidate market fit. You can use Markdown formatting like **bold** and _italic_ text, bulleted or numbered lists, or [links](https://...)."}
                    onSaveStart={onSaveCMFStart}
                    onSaveError={onSaveDisplayError}
                  />
                </div>
              </div>
            </div>
            <pre className={styles.rawData}>{rawData}</pre>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/JSC-Tracker/images/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/JSC-Tracker/images/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/JSC-Tracker/images/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
