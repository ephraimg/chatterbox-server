/* Import node's http module: */
var http = require('http');
var requestHandler = require('./request-handler');
var fs = require('fs');

// var messages = [];

// // get all stored messages, set those as our messages array
// fs.readFile('./server/messageBank.js', (err, data) => {
//   var results;
//   if (err) { throw err; }
//   var parsedFile = data.toString().split(',\n');
//   messages = parsedFile.map(message => JSON.parse(message));
// });

// // when new message posted, we'll use this to store it permanently
// var addToMessageBank = function(stringMessage) {
//   fs.appendFile('./server/messageBank.js', ',\n' + stringMessage, (err) => {
//     if (err) { console.error(err); }
//   });
// };

// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = '127.0.0.1';



// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
var server = http.createServer(requestHandler.requestHandler);
console.log('Listening on http://' + ip + ':' + port);
server.listen(port, ip);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

