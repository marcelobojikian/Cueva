
// module variables
const config = require('./config.json');
const environment = process.env.NODE_ENV || 'testing';
const environmentConfig = config[environment];

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = environmentConfig;

// log global.gConfig
console.log(`Config: ${JSON.stringify(global.gConfig.config_id)}`);