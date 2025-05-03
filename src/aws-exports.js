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
      redirectSignIn: 'https://jsc-tracker.infinitequack.net',
      redirectSignOut: 'https://jsc-tracker.infinitequack.net/logout',
      responseType: 'code'
    }
  }
};

export default awsConfig;
