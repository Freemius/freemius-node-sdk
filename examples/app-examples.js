const Freemius = require('./Freemius');
const { logResponse } = require('./utility.js');
const { FS__API_APP_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY } = require('./keys.js');
const fs = require('fs');
const app = new Freemius('app', FS__API_APP_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY);

// Clear the console window
process.stdout.write('\033c');

// RUN EXAMPLES

// Run the examples here...

// APP SCOPE BASED REQUESTS

// Add example requests here...
