'use client';

import { AdminUserRecord } from '../services/adminApi';
import styles from '../app/page.module.css';

interface AdminUserResultsTableProps {
  users: AdminUserRecord[];
  loading: boolean;
  error: string | null;
  onJscClick: (jscNumber: string) => void;
}

export const AdminUserResultsTable = ({
  users,
  loading,
  error,
  onJscClick
}: AdminUserResultsTableProps) => {
  const isAdmin = (user: AdminUserRecord) => {
    return user.roles && user.roles.includes('admin');
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
    </div>
  );
};
