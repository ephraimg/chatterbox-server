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
var mimeMap = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.gif': 'image/gif'
};
var messages = [];

// Serve static chatterbox files
// if (request.method === 'GET' && request.url === '/') {
//   fs.readFile(__dirname + '/../client/client/index.html', (err, data) => {
//     if (err) { console.error(); }
//     // if data has been retrieved, send it to client
//     console.log('data: ', data);
//     var statusCode = 200;
//     var headers = defaultCorsHeaders;
//     headers['Content-Type'] = 'text/html';
//     response.writeHead(statusCode, headers);
//     response.write(data);
//     response.end();
//   });  
// }
  
  
  
  

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // Serve static files for client
  if (request.method === 'GET' && request.url !== '/classes/messages') {
    var fileurl;
    if (request.url === '/' || request.url.includes('/?username=')) {
      fileurl = __dirname + '/../client/client/index.html';
    } else {
      var fileExt = path.extname(request.url);
      if (['.js', '.css', '.gif'].includes(fileExt) && !request.url.includes('bower')) {
        fileurl = __dirname + '/../client/client' + request.url;
      } else if (fileExt === '.js' && request.url.includes('bower')) {  
        fileurl = __dirname + '/../client' + request.url;
      }
      var mimeType = mimeMap[fileExt];
    }
    response.writeHead(200, { 'Content-Type': mimeType });
    fs.createReadStream(fileurl).pipe(response);

  // 404 if wrong url
  } else if (request.url !== '/classes/messages' || 
    !['GET', 'POST', 'OPTIONS'].includes(request.method)) {
    defaultCorsHeaders['Content-Type'] = 'text/plain';
    response.writeHead(404, defaultCorsHeaders);
    response.end('Not allowed!');

  // deal with POST request
  } else {
    if (request.method === 'POST' && request.url === '/classes/messages') {
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
        // addToMessageBank(JSON.stringify(messageObject));
        var statusCode = 201;
        var headers = defaultCorsHeaders;
        headers['Content-Type'] = 'application/json';
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify({results: messages}));
      });

    // deal with GET request
    } else if (request.method === 'GET' && request.url === '/classes/messages') {
      // fs.readFile('./server/messageBank.js', (err, data) => {
      //   if (err) throw err;
      //   var parsedFile = data.toString().split(',\n');
      //   parsedFile = parsedFile.map(message => JSON.parse(message));
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(200, defaultCorsHeaders);
      // response.end(JSON.stringify({results: parsedFile}));
      response.end(JSON.stringify({results: messages}));
      // });

    // deal with OPTIONS request
    } else if (request.method === 'OPTIONS') {
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'text/plain';
      response.writeHead(200, defaultCorsHeaders);
      response.end('Allowed methods: POST, GET.');
    }
    
  }
};

exports.requestHandler = requestHandler;
