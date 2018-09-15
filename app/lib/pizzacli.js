/*
 * Pizza Service CLI tasks
 *
 */

// Dependencies
var readline = require('readline');
var util = require('util');
var debug = util.debuglog('cli');
var events = require('events');
class _events extends events{};
var e = new _events();

// Instantiate CLI module obejct
var pizzacli = {};

// Input handlers
e.on('man', function(str) {
  pizzacli.responders.help();
});

e.on('help', function(str) {
  pizzacli.responders.help();
});

e.on('exit', function(str) {
  pizzacli.responders.exit();
});

e.on('menu', function(str) {
  pizzacli.responders.menu();
});

e.on('list orders', function(str) {
  pizzacli.responders.listOrders();
});

e.on('lookup order', function(str) {
  pizzacli.responders.lookUpOrder(str);
});

e.on('list users', function(str) {
  pizzacli.responders.listUsers(str);
});

e.on('lookup user', function(str) {
  pizzacli.responders.lookUpUser(str);
});

// Responders object
pizzacli.responders = {};

// Help / man responder
pizzacli.responders.help = function() {
  console.log("You asked for help");
};

// Exit
pizzacli.responders.exit = function() {
  console.log("You asked for exit");
};

// Show the ingredients in the menu
pizzacli.responders.menu = function() {
  console.log("You asked for menu");
};

// List all the orders in the last "n" hours specified in the passed string, default to 24h
pizzacli.responders.listOrders = function() {
  console.log("You asked for orders");
};

// Look up a specific order by order ID
pizzacli.responders.lookUpOrder = function() {
  console.log("You asked to lookup order");
};

// List all the users in the last "n" hours specified in the passed string, default to 24h
pizzacli.responders.listUsers = function(str) {
  console.log("You asked for users", str);
};

// Look up a specific user by mail address
pizzacli.responders.lookUpUser = function(str) {
  console.log("You asked to lookup user", str);
};


// Input processor
pizzacli.processInput = function(str) {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;

  // Only process the input when user entered something. Otherwise ignore
  if (str) {
    // Codify the unique allowed question strings
    var uniqueInputs = [
      'man',
      'help',
      'exit',
      'menu',
      'list orders',
      'lookup order',
      'list users',
      'lookup user'
    ];

    // Go through the possible inputs, and emit an event when a match is found
    var matchFound = false;
    var counter = 0;
    uniqueInputs.some(function(input) {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;

        // Emit an event matching the unique input, and include the full string given
        e.emit(input, str);

        return true;
      }
    });

    // If no match is found, tell the user to try again
    if (!matchFound) {
      console.log("Command not found. Try again");
    }
  }
};

// Initialization script
pizzacli.init = function() {

  // Send start message to console, in dark blue style
  console.log('\x1b[34m%s\x1b[0m', "The Pizza CLI is running");

  // Start the interface
  var _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'PIZZA_CLI > '
  });

  // Create the prompt the user will see
  _interface.prompt();

  // Handle the input lines separately
  _interface.on('line', function(str) {
    // Send to the input processor
    pizzacli.processInput(str);

    // Reinit the prompt
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on('close', function() {
    process.exit(0);
  });

};

// Export module
module.exports = pizzacli;
