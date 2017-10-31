// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
}; 

var path = require('path');
var fs = require('fs');
// var messages = [];

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // 404 if wrong url
  if (request.url !== '/classes/messages' || 
    !['GET', 'POST', 'OPTIONS'].includes(request.method)) {
    defaultCorsHeaders['Content-Type'] = 'text/plain';
    response.writeHead(404, defaultCorsHeaders);
    response.end('Not allowed!');

  // deal with POST request
  } else {
    if (request.method === 'POST') {
      let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        var messageObject = JSON.parse(body);
        if (messageObject['roomname'] === undefined) {
          messageObject['roomname'] = 'lobby';
        }
        messageObject.createdAt = Date.now();
        messages.push(messageObject);
        var statusCode = 201;
        var headers = defaultCorsHeaders;
        headers['Content-Type'] = 'application/json';
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify({results: messages}));
      });

    // deal with GET request
    } else if (request.method === 'GET') {
      fs.readFile('./server/messageBank.js', (err, data) => {
        if (err) throw err;
        var parsedFile = data.toString().split(',\n');
        parsedFile = parsedFile.map(message => JSON.parse(message));
        defaultCorsHeaders['Content-Type'] = 'application/json';
        response.writeHead(200, defaultCorsHeaders);
        response.end(JSON.stringify({results: parsedFile}));
      });

    // deal with OPTIONS request
    } else if (request.method === 'OPTIONS') {
      defaultCorsHeaders['Content-Type'] = 'text/plain';
      response.writeHead(200, defaultCorsHeaders);
      response.end('Allowed methods: POST, GET.');
    }
    
  }
};

exports.requestHandler = requestHandler;
