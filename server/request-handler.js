/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var path = require('path');




var messages = [];







var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.url === '/chatterbox/classes/message') {

    if (request.method === 'GET') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;  
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
// 'Here are the messages.', 
      response.end(JSON.stringify(messages));

    } else if (request.method === 'POST') {

      let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        // console.log(JSON.stringify(body));
        body = Buffer.concat(body).toString();
        // console.log(body);
        messages.push(JSON.parse(body));
        // console.log(messages);
      });


      var statusCode = 201;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end('Message posted!');
    } else if (request.method === 'OPTIONS') {
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end('Allowed methods: POST, GET.');
    } else {
      var statusCode = 404;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(statusCode, headers);
      response.end('Not allowed!');
    }
  } else {
    var statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, headers);
    response.end('Not allowed!');
  }

};

exports.requestHandler = requestHandler;

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

