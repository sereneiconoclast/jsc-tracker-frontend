const awsConfig = {
  Auth: {
    region: 'us-west-2',
    // From JSCTrackerCognitoUserPoolId
    userPoolId: 'us-west-2_dMm3OHnHQ',
    // From JSCTrackerCognitoUserPoolAppClientId
    userPoolWebClientId: '4sinnfdl9rt41sskhage40qn7r',
    oauth: {
      domain: 'auth.jsc-tracker.infinitequack.net',
      scope: ['openid', 'profile', 'email', 'phone'],
      redirectSignIn: 'http://localhost:3000',
      redirectSignOut: 'http://localhost:3000',
      responseType: 'code'
    }
  }
};

// Add debug logging
console.log('AWS Config:', awsConfig);

export default awsConfig;
