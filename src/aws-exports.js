const awsConfig = {
  Auth: {
    region: 'us-west-2',
    userPoolId: 'YOUR_USER_POOL_ID', // Replace with actual value from CloudFormation output
    userPoolWebClientId: 'YOUR_CLIENT_ID', // Replace with actual value from CloudFormation output
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
