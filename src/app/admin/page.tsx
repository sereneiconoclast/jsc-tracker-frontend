'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AdminUserSearchForm } from '../../components/AdminUserSearchForm';
import { AdminUserResultsTable } from '../../components/AdminUserResultsTable';
import { adminApiService, AdminUserSearchParams, AdminUserRecord } from '../../services/adminApi';
import styles from '../page.module.css';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    __pendingMoveResolve?: () => void;
    __pendingMoveReject?: (error: unknown) => void;
  }
}

export default function AdminPage() {
  const { accessToken } = useAuth();
  const [searchParams, setSearchParams] = useState<AdminUserSearchParams>({});
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingMove, setPendingMove] = useState<{
    userSubs: string[];
    targetJsc: string;
    targetJscUsers: AdminUserRecord[];
  } | null>(null);

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

  const handleSearchParamsChange = (params: Partial<AdminUserSearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  const handleMoveUsers = async (userSubs: string[], targetJsc: string): Promise<void> => {
    if (!accessToken) throw new Error('No access token');

    // Validation checks
    if (userSubs.length === 0) {
      throw new Error('First select one or more people to move');
    }

    if (!targetJsc.trim()) {
      throw new Error('First enter the number of an existing JSC');
    }

    const jscNumber = parseInt(targetJsc.trim());
    if (isNaN(jscNumber) || jscNumber <= 0) {
      throw new Error('Please enter a valid positive integer for the JSC number');
    }

    try {
      // First, check if the target JSC exists by searching for its members
      const targetJscResponse = await adminApiService.searchUsers(accessToken, { jsc: targetJsc });
      const targetJscUsers = targetJscResponse.data.users;

      // Store pending move data and show confirmation dialog
      setPendingMove({ userSubs, targetJsc, targetJscUsers });
      setShowConfirmDialog(true);

      // Return a promise that will be resolved when the user confirms
      return new Promise<void>((resolve, reject) => {
        // Store resolve/reject functions to be called later
        window.__pendingMoveResolve = resolve;
        window.__pendingMoveReject = reject;
      });

    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const response = (error as { response?: { data?: { error?: string } } }).response;
        if (response?.data?.error?.includes('No such JSC')) {
          throw new Error(`JSC ${targetJsc} does not exist`);
        }
        // Handle other API errors
        if (response?.data?.error) {
          throw new Error(response.data.error);
        }
      }
      // Handle network errors or other issues
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  };

  const handleConfirmMove = async () => {
    if (!pendingMove || !accessToken) return;

    try {
      setShowConfirmDialog(false);

      // Call the assign API
      await adminApiService.assignUsersToJsc(accessToken, pendingMove.userSubs, pendingMove.targetJsc);

      // Resolve the promise
      if (window.__pendingMoveResolve) {
        window.__pendingMoveResolve();
        window.__pendingMoveResolve = undefined;
        window.__pendingMoveReject = undefined;
      }

      setPendingMove(null);
    } catch (error) {
      // Reject the promise
      if (window.__pendingMoveReject) {
        window.__pendingMoveReject(error);
        window.__pendingMoveResolve = undefined;
        window.__pendingMoveReject = undefined;
      }
      setPendingMove(null);
      throw error;
    }
  };

  const handleCancelMove = () => {
    setShowConfirmDialog(false);
    setPendingMove(null);

    // Reject the promise
    if (window.__pendingMoveReject) {
      window.__pendingMoveReject(new Error('Move canceled'));
      window.__pendingMoveResolve = undefined;
      window.__pendingMoveReject = undefined;
    }
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
              onSearchParamsChange={handleSearchParamsChange}
              onSearch={handleSearch}
            />

            {hasSearched && (
              <AdminUserResultsTable
                users={users}
                loading={loading}
                error={error}
                onJscClick={handleJscClick}
                onMoveUsers={handleMoveUsers}
              />
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && pendingMove && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <h3>Confirm Move</h3>
            <div className={styles.dialogContent}>
              <p>Move these people into JSC {pendingMove.targetJsc}?</p>

              {pendingMove.targetJscUsers.length === 0 ? (
                <p>This JSC is currently empty.</p>
              ) : (
                <>
                  <p>It contains {pendingMove.targetJscUsers.length} members:</p>
                  <ul>
                    {pendingMove.targetJscUsers.map(user => (
                      <li key={user.sub}>{user.name}</li>
                    ))}
                  </ul>
                </>
              )}

              <p>New members:</p>
              <ul>
                {users
                  .filter(user => pendingMove.userSubs.includes(user.sub))
                  .map(user => {
                    const status = user.jsc && user.jsc !== '-1'
                      ? `(currently in JSC ${user.jsc})`
                      : '(not in any JSC)';
                    return (
                      <li key={user.sub}>{user.name} {status}</li>
                    );
                  })}
              </ul>
            </div>
            <div className={styles.dialogButtons}>
              <button className={styles.dialogButton} onClick={handleConfirmMove}>
                OK
              </button>
              <button className={styles.dialogButton} onClick={handleCancelMove}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
