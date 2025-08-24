import { useState, useEffect, useCallback } from 'react';
import { adminApiService, AdminUserSearchParams, AdminUserRecord } from '../services/adminApi';

export function useAdminUserSearch(accessToken: string) {
  const [searchParams, setSearchParams] = useState<AdminUserSearchParams>({});
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (params: AdminUserSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiService.searchUsers(accessToken, params);
      setUsers(response.data.users);
    } catch (err: unknown) {
      console.error('Error searching users:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : err instanceof Error ? err.message : 'Failed to search users';
      setError(errorMessage || 'Failed to search users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const updateSearchParams = useCallback((newParams: Partial<AdminUserSearchParams>) => {
    const updatedParams = { ...searchParams, ...newParams };
    setSearchParams(updatedParams);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounced search
    const timer = setTimeout(() => {
      performSearch(updatedParams);
    }, 750);

    setDebounceTimer(timer);
  }, [searchParams, debounceTimer, performSearch]);

  // Initial search on mount
  useEffect(() => {
    performSearch({});
  }, [performSearch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    searchParams,
    updateSearchParams,
    users,
    loading,
    error,
    performSearch
  };
}
