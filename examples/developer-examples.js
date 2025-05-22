const Freemius = require('.././Freemius');
const { logResponse } = require('./utility.js');
const { FS__API_DEV_ID, FS__API_PLUGIN_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY } = require('./keys.js');
const strtotime = require('locutus/php/datetime/strtotime');
const fs = require('fs');
const developer = new Freemius('developer', FS__API_DEV_ID, FS__API_PUBLIC_KEY, FS__API_SECRET_KEY);

// Clear the console window
process.stdout.write('\033c');

// RUN EXAMPLES

//getAllPluginVersions();
//getAllPluginDetails();
getSpecificPluginDetails(FS__API_PLUGIN_ID);
//getActiveSites();
//downloadSpecificPluginZip(14418); // not currently working
//updatePluginTitle('New Plugin Title!');
//deployPluginZip('freemius.zip'); // not tested yet
//findClockDiff();

// DEVELOPER SCOPE BASED REQUESTS

/**
 * Get active sites for a particular plugin.
 * 
 * @see https://docs.freemius.com/api/installations/list-installs
 */
function getActiveSites() {
  developer.Api('/plugins/' + FS__API_PLUGIN_ID + '/installs.json', 'GET', [], [], function (sites) {
    // list active sites
    console.log(JSON.parse(sites));

    // list just the active site URLs
    JSON.parse(sites).installs.forEach(function(site) {
      console.log(site.url);
    });
  });
}

/**
 * Get all plugin versions deployed.
 * 
 * @see https://docs.freemius.com/api/deployments/list
 */
function getAllPluginVersions() {
  developer.Api('/plugins/' + FS__API_PLUGIN_ID + '/tags.json', 'GET', [], [], function (e) {
    logResponse(e, developer);
  });
}

/**
 * Get all plugin details.
 * 
 * @see https://freemius.docs.apiary.io/#reference/plugins/plugins-collection/list-all-plugins
 */
function getAllPluginDetails() {
  developer.Api('/plugins.json', 'GET', [], [], function (e) {
    logResponse(e, developer);
  });
}

/**
 * Get specific plugin information.
 * 
 * @see https://docs.freemius.com/api/products/get-info
 */
function getSpecificPluginDetails(plugin_id) {
  developer.Api('/plugins/' + plugin_id + '.json', 'GET', [], [], function (e) {
    logResponse(e, developer);
  });
}

/**
 * Download a specific deployed version of the product.
 * 
 * @see https://docs.freemius.com/api/deployments/download
 */
function downloadSpecificPluginZip(tag_id) {
  developer.Api('/plugins/' + FS__API_PLUGIN_ID + '/tags/' + tag_id + '.zip?is_premium=false', 'GET', [], [], function (data) {
    logResponse(e, developer, false);
    // TODO: Need to create the zip ourselves? Put contents into a file.
    fs.writeFileSync('C:/Users/dvgwy/Desktop/aaa/plugins/zippy.zip', data, 'binary');
  });
}

/**
 * Update plugin title.
 * 
 * @see https://docs.freemius.com/api/products/update
 */
function updatePluginTitle(title) {
    developer.Api("/plugins/" + FS__API_PLUGIN_ID + ".json", 'PUT', { 'title': title }, {}, function (e) {
      logResponse(e, developer, false);
  });
}

/**
 * Deploy plugin zip file to freemius.
 * 
 * @see https://docs.freemius.com/api/deployments/create
 */
function deployPluginZip(zipFile) {
  developer.Api('plugins/' + FS__PLUGIN_ID + '/tags.json', 'POST', {
    'add_contributor': true
  }, {
    'file': zipFile
  }, function (e) {
    logResponse(e, developer, false);
  });
}

// Not sure what this does exactly? Get's a Unix timestamp of the time difference between freemius server and local computer time?
function findClockDiff() {
  developer.FindClockDiff(function (e) {
    let timediff = Date.now() - strtotime(JSON.parse(e).timestamp);
    console.log(timediff);
  });
}
