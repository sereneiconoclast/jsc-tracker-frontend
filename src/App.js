import logo from './logo.svg';
import './App.css';

import { Amplify } from 'aws-amplify';
import { getCurrentUser, fetchAuthSession, signInWithRedirect } from '@aws-amplify/auth';
import awsConfig from './aws-exports';
import { useEffect, useState } from 'react';

// Add debug logging for Amplify configuration
console.log('Initializing Amplify with config:', awsConfig);
try {
  Amplify.configure(awsConfig);
  console.log('Amplify configured successfully');
} catch (error) {
  console.error('Error configuring Amplify:', error);
}

function App() {
  const [authState, setAuthState] = useState('checking');
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check authentication status
    getCurrentUser()
      .then(user => {
        console.log('User is authenticated:', user);
        setAuthState('authenticated');
        return fetchAuthSession();
      })
      .then(session => {
        console.log('Auth session:', session);
        setUserInfo(session.tokens.idToken.payload);
      })
      .catch(err => {
        console.log('User is not authenticated:', err);
        setAuthState('unauthenticated');
        setError(err);
      });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Error during Google login:', error);
      setError(error);
    }
  };

  if (error) {
    return (
      <div className="App">
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>JSC Tracker</h1>

      {authState === 'checking' && <p>Checking authentication status...</p>}

      {authState === 'unauthenticated' && (
        <div>
          <p>Not authenticated</p>
          <button onClick={handleGoogleLogin}>Login via Google</button>
        </div>
      )}

      {authState === 'authenticated' && userInfo && (
        <div>
          <h2>User Information</h2>
          <pre>
            {JSON.stringify({
              sub: userInfo.sub,
              name: userInfo.name,
              email: userInfo.email,
              given_name: userInfo.given_name,
              family_name: userInfo.family_name,
              phone_number: userInfo.phone_number
            }, null, 2)}
          </pre>
        </div>
      )}

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
