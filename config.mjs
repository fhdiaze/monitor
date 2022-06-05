const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  name: 'staging',
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  name: 'production',
};

const currentEnv =
  typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV : '';

const environment =
  typeof environments[currentEnv] == 'object'
    ? environments[currentEnv]
    : environments['staging'];

export { environment };
