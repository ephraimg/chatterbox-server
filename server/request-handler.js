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
var headers = defaultCorsHeaders;

var path = require('path');
var fs = require('fs');
var mimeMap = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.gif': 'image/gif'
};

var messages = [];

// On initialization, get all stored messages, set those as our messages array
fs.readFile('./server/messageBank.txt', (err, data) => {
  if (err) { throw err; }
  var parsedFile = data.toString().split(',\n');
  messages = parsedFile.map(message => JSON.parse(message));
});

 

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // Handle GET requests
  if (request.method === 'GET') {
    
    // Respond to API messages endpoint with results
    if (request.url === '/classes/messages') {
      headers['Content-Type'] = 'application/json';
      response.writeHead(200, headers);
      response.end(JSON.stringify({results: messages}));
    } else {
    
      // Respond to other requests with static files
      var fileExt = path.extname(request.url);
      if (['.js', '.css', '.gif'].includes(fileExt)) {
        var fileurl = request.url.includes('bower') ? request.url : '/client' + request.url;
        headers['Content-Type'] = mimeMap[fileExt];
        
      // Respond to base url requests with index page  
      } else if (request.url === '/' || request.url.includes('/?username=')) {
        var fileurl = '/client/index.html';
        headers['Content-Type'] = 'text/html';
      }
      
      // Pipe the file into the response, 404 if no file
      response.writeHead(200, headers);
      var read = fs.createReadStream(__dirname + '/../client' + fileurl);
      read.on('error', function() { 
        response.writeHead(404, defaultCorsHeaders);
        response.end('File not found');
      });
      read.pipe(response);        
    } 
  }

  // Handle POST requests
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
      var stringMessage = JSON.stringify(messageObject);
      fs.appendFile('./server/messageBank.txt', ',\n' + stringMessage, (err) => {
        if (err) { console.error(err); }
      });
      headers['Content-Type'] = 'application/json';
      response.writeHead(201, headers);
      response.end(JSON.stringify({results: messages}));
    });
  }
  
  // Handle OPTIONS requests
  if (request.method === 'OPTIONS') {
    response.writeHead(200, defaultCorsHeaders);
    response.end('Allowed methods: POST, GET.');
  }
  
  // 404 otherwise
  if (!['GET', 'POST', 'OPTIONS'].includes(request.method)) {
    response.writeHead(404, defaultCorsHeaders);
    response.end('Not allowed!');
  }

};

exports.requestHandler = requestHandler;
