'use client';

import styles from '../page.module.css';

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          <div className={styles.userProfile}>
            <h1>Admin Interface</h1>
            <p>This is the admin page</p>
          </div>
        </div>
      </main>
    </div>
  );
}
