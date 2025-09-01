'use client';

import { useState } from 'react';
import { AdminUserRecord } from '../services/adminApi';
import styles from '../app/page.module.css';

interface AdminUserResultsTableProps {
  users: AdminUserRecord[];
  loading: boolean;
  error: string | null;
  onJscClick: (jscNumber: string) => void;
  onMoveUsers: (userSubs: string[], targetJsc: string) => Promise<void>;
}

export const AdminUserResultsTable = ({
  users,
  loading,
  error,
  onJscClick,
  onMoveUsers
}: AdminUserResultsTableProps) => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [targetJsc, setTargetJsc] = useState<string>('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isAdmin = (user: AdminUserRecord) => {
    return user.roles && user.roles.includes('admin');
  };

  const handleUserSelection = (userSub: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userSub);
    } else {
      newSelected.delete(userSub);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(users.map(user => user.sub)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleMoveClick = async () => {
    if (selectedUsers.size === 0) {
      setErrorMessage('First select one or more people to move');
      setShowErrorDialog(true);
      return;
    }

    if (!targetJsc.trim()) {
      setErrorMessage('First enter the number of an existing JSC');
      setShowErrorDialog(true);
      return;
    }

    const jscNumber = parseInt(targetJsc.trim());
    if (isNaN(jscNumber) || jscNumber <= 0) {
      setErrorMessage('Please enter a valid positive integer for the JSC number');
      setShowErrorDialog(true);
      return;
    }

    try {
      await onMoveUsers(Array.from(selectedUsers), targetJsc.trim());
      setSelectedUsers(new Set());
      setTargetJsc('');
    } catch (error) {
      // Display error to user
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(message);
      setShowErrorDialog(true);
    }
  };

  const renderUserPicture = (user: AdminUserRecord) => {
    if (user.picture_data) {
      return (
        <img
          src={`data:image/jpeg;base64,${user.picture_data}`}
          alt={`${user.name}'s profile picture`}
          width={48}
          height={48}
          className={styles.adminUserPicture}
        />
      );
    }
    return (
      <div className={styles.adminUserPicturePlaceholder}>
        {user.name.charAt(0)}
      </div>
    );
  };

  const renderJscCell = (user: AdminUserRecord) => {
    if (user.jsc && user.jsc !== '-1') {
      return (
        <button
          className={styles.jscLink}
          onClick={() => onJscClick(user.jsc!)}
          title="Click to search for this JSC"
        >
          {user.jsc}
        </button>
      );
    }
    return <span>➖</span>;
  };

  const renderAdminCell = (user: AdminUserRecord) => {
    return isAdmin(user) ? <span>👑</span> : <span></span>;
  };

  const renderErrorDialog = () => {
    if (!showErrorDialog) return null;

    return (
      <div className={styles.dialogOverlay}>
        <div className={styles.dialog}>
          <h3>Error</h3>
          <div className={styles.dialogContent}>
            <p>{errorMessage}</p>
          </div>
          <div className={styles.dialogButtons}>
            <button
              className={styles.dialogButton}
              onClick={() => setShowErrorDialog(false)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.adminTableContainer}>
        <div className={styles.loadingMessage}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.adminTableContainer}>
        <div className={styles.errorMessage}>Error: {error}</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={styles.adminTableContainer}>
        <table className={styles.adminUserTable}>
          <thead>
            <tr>
              <th>Select</th>
              <th>Picture</th>
              <th>Name</th>
              <th>Email</th>
              <th>JSC #</th>
              <th>Admin?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>➖</td>
              <td>➖</td>
              <td>(No matches)</td>
              <td>➖</td>
              <td>➖</td>
              <td>➖</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.adminTableContainer}>
      <table className={styles.adminUserTable}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedUsers.size === users.length && users.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th>Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>JSC #</th>
            <th>Admin?</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.sub}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.sub)}
                  onChange={(e) => handleUserSelection(user.sub, e.target.checked)}
                />
              </td>
              <td>{renderUserPicture(user)}</td>
              <td>{user.name}</td>
              <td>
                <a href={`mailto:${user.email}`} className={styles.emailLink}>
                  {user.email}
                </a>
              </td>
              <td>{renderJscCell(user)}</td>
              <td>{renderAdminCell(user)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.moveInterface}>
        <label>
          Move to JSC:
          <input
            type="text"
            value={targetJsc}
            onChange={(e) => setTargetJsc(e.target.value)}
            placeholder="Enter JSC#"
            className={styles.jscInput}
          />
        </label>
        <button
          className={styles.moveButton}
          onClick={handleMoveClick}
          disabled={selectedUsers.size === 0}
        >
          Move!
        </button>
      </div>

      {renderErrorDialog()}
    </div>
  );
};
