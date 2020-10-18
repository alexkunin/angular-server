#!/usr/bin/env node

const express = require('express');
const http = require('http');
const middleware = require('@alexkunin/angular-server-middleware');
const commandLineParser = require('@alexkunin/angular-server-command-line-parser');

const options = commandLineParser(process.argv.slice(2));

if (options.$.length !== 0) {
  throw new Error('Only options are supported, no non-option arguments should be passed on command line');
}

let serverOptions = { port: 3025 };
if (options.server) {
  serverOptions = options.server;
  delete options.server;
}

let { $, ...middlewareOptions } = options;

const app = express();
app.use(middleware(middlewareOptions));

const server = http.createServer(app);
server.listen(serverOptions, () => process.stdout.write(`Angular server is listening: ${JSON.stringify(server.address())}\n`));

