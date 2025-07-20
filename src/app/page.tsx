'use client';

import styles from "./page.module.css";
import { getAuthCookie, clearAuthCookie } from '../utils/cookies';
import { useState, useEffect } from 'react';
import { AuthState, UserRecord, ContactRecord, ApiError, UserApiResponse } from '../types/auth';
import { AxiosResponse } from 'axios';
import { LoginSection } from '../components/LoginSection';
import { UserProfile } from '../components/UserProfile';
import { ContactsList } from '../components/ContactsList';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Footer } from '../components/Footer';
import { userApiService } from '../services/userApi';

export default function Home() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  // Note: Mutating the array not allowed; instead, replace it with a new object
  const [contactRecords, setContactRecords] = useState<ContactRecord[]>([]);
  const [rawData, setRawData] = useState<string>('(Please wait)');
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<{ [role: string]: string } | null>(null);

  useEffect(() => {
    const cookie = getAuthCookie();
    setAuth(cookie);
  }, []);

  useEffect(() => {
    if (auth?.access_token) {
      userApiService.getUser(auth.access_token)
        .then((response: AxiosResponse<UserApiResponse>) => {
          setUserRecord(response.data.users[0]);
          setContactRecords(response.data.contacts || []);
          setUserRoles(response.data.roles || null);
          setRawData(JSON.stringify(response.data, null, 2));
        })
        .catch((error: ApiError) => {
          setRawData(`Error: ${error.message}`);
        });
    }
  }, [auth]);

  const handleLogout = () => {
    clearAuthCookie();
    setAuth(null);
    setUserRecord(null);
    setContactRecords([]);
    setUserRoles(null);
    setRawData('(Please wait)');
    setError(null);
  };

  const onSaveDisplayError = (error: ApiError) => {
    setError(error.response?.data?.error || error.message || 'Failed to save changes');
  };

  const buildSaveHandlerForUserField = (fieldName: keyof UserRecord) => {
    return async (newValue: string) => {
      if (!userRecord || !auth) return;
      await userApiService.postUser(auth.access_token, fieldName, newValue, userRecord.sub);
      setUserRecord({ ...userRecord, [fieldName]: newValue });
    };
  };

  const buildSaveHandlerForContactField = (fieldName: keyof ContactRecord) => {
    return async (contactId: string, newValue: string) => {
      if (!userRecord || !auth) return;
      await userApiService.postContact(auth.access_token, contactId, fieldName, newValue);
      setContactRecords(prevContacts => {
        // Find the contact that was updated
        const updatedContact = prevContacts.find(contact => contact.contact_id === contactId);
        if (!updatedContact) return prevContacts;

        // Update the contact with the new value
        const contactWithUpdate = { ...updatedContact, [fieldName]: newValue };

        // Move the updated contact to the front of the list
        const otherContacts = prevContacts.filter(contact => contact.contact_id !== contactId);
        return [contactWithUpdate, ...otherContacts];
      });
    };
  };

  const onSaveUserNameStart = buildSaveHandlerForUserField('name');
  const onSaveUserEmailStart = buildSaveHandlerForUserField('email');
  const onSaveSlackProfileStart = buildSaveHandlerForUserField('slack_profile');
  const onSaveTwoPagerStart = buildSaveHandlerForUserField('twopager');
  const onSaveCMFStart = buildSaveHandlerForUserField('cmf');
  const onSaveContactInfoStart = buildSaveHandlerForUserField('contact_info');

  const onSaveContactNameStart = buildSaveHandlerForContactField('name');
  const onSaveContactInfoFieldStart = buildSaveHandlerForContactField('contact_info');
  const onSaveContactNotesStart = buildSaveHandlerForContactField('notes');
  const onSaveContactStatusStart = buildSaveHandlerForContactField('status');

  const handleAddContact = async () => {
    if (!userRecord || !auth) return;

    try {
      const response = await userApiService.createContact(auth.access_token);
      const newContact = response.data.contact;
      // Sends a function to React to make the update, since it can happen
      // asynchronously; this avoids the possibility of using a stale value
      setContactRecords(prevContacts => [newContact, ...prevContacts]);
    } catch (error: unknown) {
      onSaveDisplayError(error as ApiError);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {!auth ? (
          <LoginSection onAuthChange={setAuth} />
        ) : userRecord ? (
          <div className={styles.contentContainer}>
            <ErrorDisplay error={error} onDismiss={() => setError(null)} />
            <div className={styles.logoutContainer}>
              {userRoles && Object.entries(userRoles).map(([role, url]) => (
                <a
                  key={role}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.adminLink}
                >
                  Switch to role: {role.charAt(0).toUpperCase() + role.slice(1)}
                </a>
              ))}
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
            <UserProfile
              userRecord={userRecord}
              onSaveUserNameStart={onSaveUserNameStart}
              onSaveUserEmailStart={onSaveUserEmailStart}
              onSaveSlackProfileStart={onSaveSlackProfileStart}
              onSaveTwoPagerStart={onSaveTwoPagerStart}
              onSaveCMFStart={onSaveCMFStart}
              onSaveContactInfoStart={onSaveContactInfoStart}
              onSaveDisplayError={onSaveDisplayError}
            />
            <ContactsList
              contactRecords={contactRecords}
              onAddContact={handleAddContact}
              onSaveContactName={onSaveContactNameStart}
              onSaveContactInfo={onSaveContactInfoFieldStart}
              onSaveContactNotes={onSaveContactNotesStart}
              onSaveContactStatus={onSaveContactStatusStart}
              onSaveDisplayError={onSaveDisplayError}
            />
            <pre className={styles.rawData}>{rawData}</pre>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
