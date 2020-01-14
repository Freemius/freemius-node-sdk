const Freemius = require('./Freemius');
const { logResponse } = require('./utility.js');
const { FS__API_USER_ID, FS__API_PLUGIN_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY } = require('./keys.js');
const fs = require('fs');
const user = new Freemius('user', FS__API_USER_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY);

// Clear the console window
process.stdout.write('\033c');

// RUN EXAMPLES

getLatestFreePluginDetails(FS__API_PLUGIN_ID);

// USER SCOPE BASED REQUESTS

// Get latest free version details (doesn't work right now)
// API - https://freemius.docs.apiary.io/#reference/plugins/updates/get-latest-free-version-details
function getLatestFreePluginDetails(plugin_id) {
  user.Api('/plugins/' + plugin_id + '/updates/latest.json', 'GET', [], [], function (e) {
    logResponse(e, user);
  });
}