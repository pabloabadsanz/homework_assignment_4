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
var config = require('../config');

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
  var commands = {
    'exit': 'Kill the CLI (and the rest of the application)',
    'man': 'Show this help page',
    'help': 'Alias of the "man" command',
    'menu': 'List all the ingredients in the menu',
    'list orders --{hours}': 'Show the list of all the orders placed in the last {hours}, default to 24h',
    'lookup order --{orderId}': 'Show details of a specific order',
    'list users --{hours}': 'Show the list of all the users who signed up in the last {hours}, default to 24h',
    'lookup user --{userId}': 'Show details of a specific user'
  };

  // Show a header for the help page that is as wide as the screen
  pizzacli.addHorizontalLine();
  pizzacli.centerText('PIZZA CLI MANUAL PAGE');
  pizzacli.addHorizontalLine();
  pizzacli.addVerticalSpace(2);

  // Show each command, followed by its explanation, in white respectively
  for(var key in commands) {
    if (commands.hasOwnProperty(key)) {
      var value = commands[key];
      var line = '\x1b[33m' + key + '\x1b[0m';
      var padding = 60 - line.length;
      for (i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;

      console.log(line);
      pizzacli.addVerticalSpace();
    }
  }

  pizzacli.addVerticalSpace();
  pizzacli.addHorizontalLine();

};

// Create a vertical space
pizzacli.addVerticalSpace = function(lines) {
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for (i = 0; i < lines; i++) {
    console.log('');
  }
};

// Create a horizontal line
pizzacli.addHorizontalLine = function() {
  // Get the available screen size
  var width = process.stdout.columns;

  var line = '';
  for (i = 0; i < width; i++) {
    line += '-';
  }

  console.log(line);
};

// Create centered text on the screen
pizzacli.centerText = function(str) {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';

  // Get the available screen size
  var width = process.stdout.columns;

  // Calculate the left padding
  var leftPadding = Math.floor((width - str.length) / 2);

  // Put in left padded spces before the string
  var line = '';
  for (i = 0; i < leftPadding; i++) {
    line += ' ';
  }
  line += str;
  console.log(line);
};

// Exit
pizzacli.responders.exit = function() {
  process.exit(0);
};

// Show the ingredients in the menu
pizzacli.responders.menu = function() {
  console.dir(config.menuItemsData, {'colors': true});
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
