'use client';

import Image from "next/image";
import { useGoogleLogin } from '@react-oauth/google';
import { setAuthCookie, getAuthCookie } from '../utils/cookies';
import { AuthState } from '../types/auth';
import styles from '../app/page.module.css';

interface LoginSectionProps {
  onAuthChange: (auth: AuthState) => void;
}

export const LoginSection = (p: LoginSectionProps) => {
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setAuthCookie(access_token);
      const cookie = getAuthCookie(); // immediately retrieve and update
      p.onAuthChange(cookie);
    },
  });

  return (
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
  );
};
