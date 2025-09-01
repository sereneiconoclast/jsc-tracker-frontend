'use client';

import { useState, useEffect } from 'react';
import { getAuthCookie, clearAuthCookie } from '../utils/cookies';
import styles from '../app/page.module.css';

export const LoginExpirationWarning = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const updateTimeLeft = () => {
      try {
        const authData = getAuthCookie();

        if (!authData) {
          // No cookie means login has expired
          setIsExpired(true);
          setTimeLeft(0);
          return;
        }

        if (!authData.expires_at) {
          // No expiration time means login has expired
          setIsExpired(true);
          setTimeLeft(0);
          return;
        }

        // Compare current time with expiration time
        const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
        const expirationTime = authData.expires_at;
        const remainingTime = Math.max(0, expirationTime - currentTime);

        setIsExpired(remainingTime === 0);
        setTimeLeft(remainingTime * 1000); // Convert back to milliseconds for consistency
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
        // On error, assume expired
        setIsExpired(true);
        setTimeLeft(0);
      }
    };

    // Update immediately
    updateTimeLeft();

    // Update every second
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render anything if more than 10 minutes left and not expired
  if (!isExpired && (timeLeft === null || timeLeft > 10 * 60 * 1000)) {
    return null;
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLoginClick = () => {
    // Clear the auth cookie to force a fresh login
    clearAuthCookie();
    // Refresh the page to trigger the login flow
    window.location.reload();
  };

  return (
    <div className={styles.loginExpirationWarning}>
      <div className={styles.loginExpirationContent}>
        {isExpired ? (
          <span>You must login again now!</span>
        ) : (
          <span>You must login again in {formatTime(timeLeft || 0)}</span>
        )}
        <button
          className={styles.loginExpirationButton}
          onClick={handleLoginClick}
        >
          Login
        </button>
      </div>
    </div>
  );
};
