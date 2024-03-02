#!/usr/bin/env node

const util = require('./distribution/util/util.js');
const args = require('yargs').argv;
const serialization = require('./distribution/util/serialization');

// Default configuration
global.nodeConfig = global.nodeConfig || {
  ip: '127.0.0.1',
  port: 8080,
  onStart: () => {
    console.log('Node started!');
  },
};

/*
    As a debugging tool, you can pass ip and port arguments directly.
    This is just to allow for you to easily startup nodes from the terminal.

    Usage:
    ./distribution.js --ip '127.0.0.1' --port 1234
  */

// process.send('Raw Args received are : '+
// serialization.serialize(serialization.deserialize(args)));


if (args.ip) {
  global.nodeConfig.ip = args.ip;
}

if (args.port) {
  global.nodeConfig.port = parseInt(args.port);
}
let composeFunc = null;
if (args.config) {
  let nodeConfig = util.deserialize(args.config);
  // process.send('Hello from the child process'+
  // JSON.stringify(nodeConfig.onStart));
  global.nodeConfig.ip = nodeConfig.ip ? nodeConfig.ip : global.nodeConfig.ip;
  global.nodeConfig.port = nodeConfig.port ?
        nodeConfig.port : global.nodeConfig.port;
  global.nodeConfig.onStart = nodeConfig.onStart ?
        nodeConfig.onStart : global.nodeConfig.onStart;
  if (args.onStartFuncDef) {
    const onStartFuncDef = util.deserialize(args.onStartFuncDef);
    const onStartFunc = global.nodeConfig.onStart;
    composeFunc = function(server, callback) {
      onStartFuncDef(server);
      onStartFunc(server, callback);
    };
  }
}

// if (args['_']!=null && args['_'][0]!=null &&
// typeof args['_'][0]==='object') {
//   global.nodeConfig = serialization.deserialize(args['_'][0]);
//   // process.send('Args received are : '+
//   // JSON.stringify(global.nodeConfig.port));
// }

const distribution = {
  util: require('./distribution/util/util.js'),
  local: require('./distribution/local/local.js'),
  node: require('./distribution/local/node.js'),
};

global.distribution = distribution;

module.exports = distribution;

/* The following code is run when distribution.js is run directly */
if (require.main === module) {
  if (composeFunc!=null) {
    distribution.node.start(composeFunc);
  } else {
    distribution.node.start(global.nodeConfig.onStart);
  }
}
