const Freemius = require('.././Freemius');
const { logResponse } = require('./utility.js');
const { FS__API_PLUGIN_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY } = require('./keys.js');
const fs = require('fs');
const plugin = new Freemius('plugin', FS__API_PLUGIN_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY);

// Clear the console window
process.stdout.write('\033c');

// RUN EXAMPLES

pingPlugins();

// PLUGIN SCOPE BASED REQUESTS

/**
 * Check if the product is active.
 * 
 * @see https://docs.freemius.com/api/products/check-status
 */
function pingPlugins() {
  plugin.Api('/ping.json', 'GET', [], [], function (e) {
    logResponse(e, developer);
  });
}

// DEVELOPER SCOPE BASED REQUESTS

// Add example requests here...
