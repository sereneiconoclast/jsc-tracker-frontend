'use client';

import styles from "./page.module.css";
import { getAuthCookie } from '../utils/cookies';
import { useState, useEffect } from 'react';
import { AuthState, UserRecord, ApiError } from '../types/auth';
import { LoginSection } from '../components/LoginSection';
import { UserProfile } from '../components/UserProfile';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Footer } from '../components/Footer';
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
      userApiService.getUser(auth.access_token)
        .then((response: any) => {
          setUserRecord(response.data.users[0]);
          setRawData(JSON.stringify(response.data, null, 2));
        })
        .catch((error: any) => {
          setRawData(`Error: ${error.message}`);
        });
    }
  }, [auth]);

  const onSaveDisplayError = (error: ApiError) => {
    setError(error.response?.data?.error || error.message || 'Failed to save changes');
  };

  const onSaveUserNameStart = async (newName: string) => {
    if (!userRecord || !auth) return;
    await userApiService.postUser(userRecord.sub, auth.access_token, 'name', newName);
    setUserRecord({ ...userRecord, name: newName });
  };

  const onSaveUserEmailStart = async (newEmail: string) => {
    if (!userRecord || !auth) return;
    await userApiService.postUser(userRecord.sub, auth.access_token, 'email', newEmail);
    setUserRecord({ ...userRecord, email: newEmail });
  };

  const onSaveSlackProfileStart = async (newProfile: string) => {
    if (!userRecord || !auth) return;
    await userApiService.postUser(userRecord.sub, auth.access_token, 'slack_profile', newProfile);
    setUserRecord({ ...userRecord, slack_profile: newProfile });
  };

  const onSaveTwoPagerStart = async (newTwoPager: string) => {
    if (!userRecord || !auth) return;
    await userApiService.postUser(userRecord.sub, auth.access_token, 'twopager', newTwoPager);
    setUserRecord({ ...userRecord, twopager: newTwoPager });
  };

  const onSaveCMFStart = async (newCMF: string) => {
    if (!userRecord || !auth) return;
    await userApiService.postUser(userRecord.sub, auth.access_token, 'cmf', newCMF);
    setUserRecord({ ...userRecord, cmf: newCMF });
  };

  const onSaveContactInfoStart = async (newContactInfo: string) => {
    if (!userRecord || !auth) return;
    await userApiService.postUser(userRecord.sub, auth.access_token, 'contact_info', newContactInfo);
    setUserRecord({ ...userRecord, contact_info: newContactInfo });
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!auth ? (
          <LoginSection onAuthChange={setAuth} />
        ) : userRecord ? (
          <>
            <ErrorDisplay error={error} onDismiss={() => setError(null)} />
            <UserProfile
              userRecord={userRecord}
              onSaveUserNameStart={onSaveUserNameStart}
              onSaveUserEmailStart={onSaveUserEmailStart}
              onSaveSlackProfileStart={onSaveSlackProfileStart}
              onSaveTwoPagerStart={onSaveTwoPagerStart}
              onSaveCMFStart={onSaveCMFStart}
              onSaveContactInfoStart={onSaveContactInfoStart}
              onSaveDisplayError={onSaveDisplayError}
            />
            <pre className={styles.rawData}>{rawData}</pre>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
