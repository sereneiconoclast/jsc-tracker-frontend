'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AdminUserSearchForm } from '../../components/AdminUserSearchForm';
import { AdminUserResultsTable } from '../../components/AdminUserResultsTable';
import { adminApiService, AdminUserSearchParams, AdminUserRecord } from '../../services/adminApi';
import styles from '../page.module.css';

export default function AdminPage() {
  const { accessToken } = useAuth();
  const [searchParams, setSearchParams] = useState<AdminUserSearchParams>({});
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.searchUsers(accessToken, searchParams);
      setUsers(response.data.users);
      setHasSearched(true);
    } catch (err: unknown) {
      console.error('Error searching users:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : err instanceof Error ? err.message : 'Failed to search users';
      setError(errorMessage || 'Failed to search users');
      setUsers([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleJscClick = (jscNumber: string) => {
    setSearchParams(prev => ({ ...prev, jsc: jscNumber }));
  };

  if (!accessToken) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.contentContainer}>
            <div className={styles.userProfile}>
              <h1>Admin Interface</h1>
              <p>Please log in to access the admin interface.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          <div className={styles.adminInterface}>
            <h1>Admin Interface</h1>

            <AdminUserSearchForm
              searchParams={searchParams}
              onSearchParamsChange={setSearchParams}
              onSearch={handleSearch}
            />

            {hasSearched && (
              <AdminUserResultsTable
                users={users}
                loading={loading}
                error={error}
                onJscClick={handleJscClick}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
