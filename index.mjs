/*
 * Primary file for the API
 */

import http from 'http';
import https from 'https';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import * as config from './lib/config.mjs';
import fs from 'fs';
import { handlers } from './lib/handlers.mjs';
import * as helpers from './lib/helpers.mjs';

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

  // Get body
  let buffer = '';
  const decoder = new StringDecoder('utf-8');
  req.on('data', data => (buffer += decoder.write(data)));
  req.on('end', () => {
    buffer += decoder.end();

    const data = {
      trimmedPath,
      query,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    route(data, (statusCode, payload) => {
      const code = typeof statusCode == 'number' ? statusCode : 200;
      const body = typeof payload == 'object' ? payload : {};
      const stringBody = JSON.stringify(body);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(code);
      res.end(stringBody);

      // Log the request path
      console.log(`Returning this response: ${code}, ${stringBody}`);
    });
  });
};

// Instantiate the HTTP server
const httpServer = http.createServer(handle);

// Start the HTTP server
httpServer.listen(config.environment.httpPort, () => {
  console.log(`The server is listening on port ${config.environment.httpPort}`);
});

// Instantiate the HTTPS server
const httpsOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};
const httpsServer = https.createServer(httpsOptions, handle);

// Start the HTTPS server
httpsServer.listen(config.environment.httpsPort, () => {
  console.log(`The server is listening on port ${config.environment.httpsPort}`);
});

const route = (data, callback) => {
  const handle = handlers[data.trimmedPath] ?? handlers.notFound;
  handle(data, callback);
};
