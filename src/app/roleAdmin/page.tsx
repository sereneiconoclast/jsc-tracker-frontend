'use client';

import styles from '../page.module.css';

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          <div className={styles.adminInterface}>
            <h1>Admin Interface</h1>

            <div className={styles.adminSearchForm}>
              <h2>User Search</h2>

              <div className={styles.searchInputs}>
                <div className={styles.searchInputGroup}>
                  <label htmlFor="name-search">Name:</label>
                  <input
                    id="name-search"
                    type="text"
                    placeholder="Search by name..."
                  />
                </div>

                <div className={styles.searchInputGroup}>
                  <label htmlFor="email-search">Email:</label>
                  <input
                    id="email-search"
                    type="text"
                    placeholder="Search by email..."
                  />
                </div>

                <div className={styles.searchInputGroup}>
                  <label htmlFor="jsc-search">JSC #:</label>
                  <input
                    id="jsc-search"
                    type="text"
                    placeholder="Search by JSC number..."
                  />
                </div>

                <div className={styles.searchInputGroup}>
                  <label htmlFor="admin-only-checkbox">
                    <input
                      id="admin-only-checkbox"
                      type="checkbox"
                    />
                    Admin only
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.adminTableContainer}>
              <div className={styles.loadingMessage}>
                User search functionality coming soon...
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
