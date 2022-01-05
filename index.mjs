/*
 * Primary file for the API
 */

import http from 'http';
import url from 'url';
import { StringDecoder } from 'string_decoder';

const handle = (req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string
  const query = parsedUrl.query;

  // Get the http method
  const method = req.method.toLowerCase();

  // Get the headers
  const headers = req.headers;
  headers.prototype = 

  // Get body
  let buffer = '';
  const decoder = new StringDecoder('utf-8');
  req.on('data', data => (buffer += decoder.write(data)));
  req.on('end', () => {
    buffer += decoder.end();

    // Send the response
    res.end('Hello World!\n');

    // Log the request path
    console.log(`Request received with this body: ${buffer}`);
  });
};

// Server responds always with a string
const server = http.createServer(handle);

// Starting the server listening on port 3000
server.listen(3000, () => {
  console.log('The server is listening on port 3000 now');
});
