import logo from './logo.svg';
import './App.css';

import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsConfig from './aws-exports';
import { useEffect } from 'react';

// Add debug logging for Amplify configuration
console.log('Initializing Amplify with config:', awsConfig);
Amplify.configure(awsConfig);

// Add debug logging for Auth state
Auth.currentAuthenticatedUser()
  .then(user => console.log('Current authenticated user:', user))
  .catch(err => console.log('No authenticated user:', err));

function App() {
  useEffect(() => {
    // Log Auth state changes
    const subscription = Auth.currentAuthenticatedUser()
      .then(user => console.log('Auth state changed - User is authenticated:', user))
      .catch(err => console.log('Auth state changed - User is not authenticated:', err));

    return () => {
      // Cleanup subscription if needed
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <h1>JSC Tracker</h1>
      <p>Authentication Status: {Auth.user ? 'Authenticated' : 'Not Authenticated'}</p>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save it to reload.
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
