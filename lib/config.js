
// Container for all environments
const environments = {};

// Development (default) environment
environments.development =  {
  'httpPort'    :  3333,
  'httpsPort'   :  3334,
  'envName'     : 'development',
  'hashingSecret' : 'itsATopSecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC40ee102f15f1cd3590963540d319d468',
    'authToken'  : 'ask me',
    'fromPhone'  : '+19892822682'
  }
};

// Production environment
environments.production = {
  'httpPort'    :  5000,
  'httpsPort'   :  5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsAlsoASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : '',
    'authToken'  : '',
    'fromPhone'  : ''
  }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of those defined above.
// default to development environment if not
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

// Export the module
module.exports = environmentToExport;
