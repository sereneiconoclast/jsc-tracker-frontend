'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useGoogleLogin } from '@react-oauth/google';
import { setAuthCookie, getAuthCookie } from '../utils/cookies';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AuthState, UserRecord, ApiError } from '../types/auth';
import { EditableText } from '../components/EditableText';
import { MarkdownEditableText } from '../components/MarkdownEditableText';
import { userApiService } from '../services/userApi';

export default function Home() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [rawData, setRawData] = useState<string>('(Please wait)');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cookie = getAuthCookie();
    setAuth(cookie);
  }, []);

  useEffect(() => {
    if (auth?.access_token) {
      userApiService.getUserData(auth.access_token)
        .then(response => {
          setUserRecord(response.data.users[0]);
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

  const onSaveDisplayError = (error: ApiError) => {
    setError(error.response?.data?.error || error.message || 'Failed to save changes');
  };

  const onSaveUserNameStart = async (newName: string) => {
    if (!userRecord || !auth) return;
    await userApiService.updateUserField(userRecord.sub, auth.access_token, 'name', newName);
    setUserRecord({ ...userRecord, name: newName });
  };

  const onSaveUserEmailStart = async (newEmail: string) => {
    if (!userRecord || !auth) return;
    await userApiService.updateUserField(userRecord.sub, auth.access_token, 'email', newEmail);
    setUserRecord({ ...userRecord, email: newEmail });
  };

  const onSaveSlackProfileStart = async (newProfile: string) => {
    if (!userRecord || !auth) return;
    await userApiService.updateUserField(userRecord.sub, auth.access_token, 'slack_profile', newProfile);
    setUserRecord({ ...userRecord, slack_profile: newProfile });
  };

  const onSaveTwoPagerStart = async (newTwoPager: string) => {
    if (!userRecord || !auth) return;
    await userApiService.updateUserField(userRecord.sub, auth.access_token, 'twopager', newTwoPager);
    setUserRecord({ ...userRecord, twopager: newTwoPager });
  };

  const onSaveCMFStart = async (newCMF: string) => {
    if (!userRecord || !auth) return;
    await userApiService.updateUserField(userRecord.sub, auth.access_token, 'cmf', newCMF);
    setUserRecord({ ...userRecord, cmf: newCMF });
  };

  const onSaveContactInfoStart = async (newContactInfo: string) => {
    if (!userRecord || !auth) return;
    await userApiService.updateUserField(userRecord.sub, auth.access_token, 'contact_info', newContactInfo);
    setUserRecord({ ...userRecord, contact_info: newContactInfo });
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
        ) : userRecord ? (
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
              {userRecord.picture_data ? (
                <img
                  src={`data:image/jpeg;base64,${userRecord.picture_data}`}
                  alt={`${userRecord.name}'s profile picture`}
                  width={64}
                  height={64}
                  className={styles.profilePicture}
                />
              ) : (
                <div className={styles.profilePicturePlaceholder}>
                  {userRecord.name.charAt(0)}
                </div>
              )}
              <div className={styles.userInfo}>
                <EditableText
                  value={userRecord.name}
                  onSaveStart={onSaveUserNameStart}
                  onSaveError={onSaveDisplayError}
                />
                <EditableText
                  value={userRecord.email}
                  onSaveStart={onSaveUserEmailStart}
                  onSaveError={onSaveDisplayError}
                />
                <div>Slack profile URL:{' '}
                <EditableText
                  value={userRecord.slack_profile}
                  editingTip={"Open your Slack profile, click three dots, then \"Copy link to profile\""}
                  onSaveStart={onSaveSlackProfileStart}
                  onSaveError={onSaveDisplayError}
                  isLink={true}
                /></div>
                <div className={styles.userTimestamps}>
                  <p>Joined {formatDistanceToNow(new Date(userRecord.created_at * 1000))} ago</p>
                  <p>Last seen {formatDistanceToNow(new Date(userRecord.modified_at * 1000))} ago</p>
                </div>
                <div>Two-pager URL:{' '}
                <EditableText
                  value={userRecord.twopager}
                  editingTip={"Link to two-pager document"}
                  onSaveStart={onSaveTwoPagerStart}
                  onSaveError={onSaveDisplayError}
                  isLink={true}
                /></div>
                <div className={styles.cmfSection}>
                  <h3>Candidate Market Fit</h3>
                  <MarkdownEditableText
                    value={userRecord.cmf}
                    editingTip={"Describe your candidate market fit. You can use Markdown formatting like **bold** and _italic_ text, bulleted or numbered lists, or [links](https://...)."}
                    onSaveStart={onSaveCMFStart}
                    onSaveError={onSaveDisplayError}
                  />
                </div>
                <div className={styles.contactInfoSection}>
                  <h3>Contact Information</h3>
                  <MarkdownEditableText
                    value={userRecord.contact_info}
                    editingTip={"Add your contact information. You can use Markdown formatting like **bold** text, bulleted lists, or [links](https://...)."}
                    onSaveStart={onSaveContactInfoStart}
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
