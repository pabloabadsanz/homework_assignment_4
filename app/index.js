/*
 * Primary file for the Pizza-delivery API
 *
 */

 // Dependencies
var server = require('./lib/server');
var tokensWorker = require('./lib/tokens_worker');
var pizzaCli = require('./lib/pizzacli');

// Declare the application
var app = {};

// Initialize the service
app.init = function() {

  // Start the server
  server.init();

  // Start the tokens worker
  tokensWorker.init();

  // Start the CLI, making sure it starts last
  setTimeout(function() {
    pizzaCli.init();
  }, 50);
};

// Execute the app
app.init();

// Export the application
module.exports = app;
