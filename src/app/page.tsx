'use client';

import Image from "next/image";
import styles from "./page.module.css";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { setAuthCookie, getAuthCookie } from '../utils/cookies';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const [auth, setAuth] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [rawData, setRawData] = useState<string>('(Please wait)');

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!auth ? (
          <>
            <button onClick={() => googleLogin()}>Login</button>
            <Image
              className={styles.logo}
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
          </>
        ) : userData ? (
          <div className={styles.userProfile}>
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
                <h1 className={styles.userName}>{userData.name}</h1>
                <p className={styles.userEmail}>{userData.email}</p>
                <div className={styles.userTimestamps}>
                  <p>Created {formatDistanceToNow(new Date(userData.created_at * 1000))} ago</p>
                  <p>Updated {formatDistanceToNow(new Date(userData.modified_at * 1000))} ago</p>
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
            src="/file.svg"
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
            src="/window.svg"
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
            src="/globe.svg"
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
