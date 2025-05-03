import logo from './logo.svg';
import './App.css';

import { Amplify } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
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

  useEffect(() => {
    // Log Auth state changes
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log('Auth state changed - User is authenticated:', user);
        setAuthState('authenticated');
      })
      .catch(err => {
        console.log('Auth state changed - User is not authenticated:', err);
        setAuthState('unauthenticated');
        setError(err);
      });
  }, []);

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
      <p>Authentication Status: {authState}</p>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Wrap with authenticator
export default withAuthenticator(App, {
  // Add debug logging for authenticator
  onAuthStateChange: (authState) => {
    console.log('Auth state changed:', authState);
  }
});
