'use client';

import { AdminUserSearchParams } from '../services/adminApi';
import styles from '../app/page.module.css';

interface AdminUserSearchFormProps {
  searchParams: AdminUserSearchParams;
  onSearchParamsChange: (params: Partial<AdminUserSearchParams>) => void;
}

export const AdminUserSearchForm = ({ searchParams, onSearchParamsChange }: AdminUserSearchFormProps) => {
  const handleInputChange = (field: keyof AdminUserSearchParams, value: string | boolean) => {
    onSearchParamsChange({ [field]: value });
  };

  return (
    <div className={styles.adminSearchForm}>
      <h2>User Search</h2>

      <div className={styles.searchInputs}>
        <div className={styles.searchInputGroup}>
          <label htmlFor="name-search">Name:</label>
          <input
            id="name-search"
            type="text"
            value={searchParams.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Search by name..."
          />
        </div>

        <div className={styles.searchInputGroup}>
          <label htmlFor="email-search">Email:</label>
          <input
            id="email-search"
            type="text"
            value={searchParams.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Search by email..."
          />
        </div>

        <div className={styles.searchInputGroup}>
          <label htmlFor="jsc-search">JSC #:</label>
          <input
            id="jsc-search"
            type="text"
            value={searchParams.jsc || ''}
            onChange={(e) => handleInputChange('jsc', e.target.value)}
            placeholder="Search by JSC number..."
          />
        </div>

        <div className={styles.searchInputGroup}>
          <label htmlFor="admin-only-checkbox">
            <input
              id="admin-only-checkbox"
              type="checkbox"
              checked={searchParams.admin_only || false}
              onChange={(e) => handleInputChange('admin_only', e.target.checked)}
            />
            Admin only
          </label>
        </div>
      </div>
    </div>
  );
};
