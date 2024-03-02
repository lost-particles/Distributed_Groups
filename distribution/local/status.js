const id = require('../util/id');
const childProcess = require('child_process');
// const {spawn} = require('child_process');
const wire = require('../util/wire.js');
const {serialize} = require('../util/util');
// const serialization = require('../util/serialization.js');
const path = require('path');

const status = {};

global.moreStatus = {
  sid: id.getSID(global.nodeConfig),
  nid: id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || console.log;

  if (configuration in global.nodeConfig) {
    callback(null, global.nodeConfig[configuration]);
  } else if (configuration in moreStatus) {
    callback(null, moreStatus[configuration]);
  } else if (configuration === 'heapTotal') {
    callback(null, process.memoryUsage().heapTotal);
  } else if (configuration === 'heapUsed') {
    callback(null, process.memoryUsage().heapUsed);
  } else {
    callback(new Error('Status key not found'));
  }
};

status.stop = function(callback=(e, v)=>{}) {
  console.log('Inside stop');
  // setTimeout(() => {
  //   console.log('Stopping the node');
  //   process.exit(0);
  // }, 500);
  process.on('exit', (code=0) => {
    global.server.close();
    console.log('Process is exiting with code:', code);
    callback(null, global.nodeConfig);
  });
  process.exit(0);
};

status.spawn = function(config, cb=(e, v)=>{}) {
  let onStartFuncDef='';
  if (typeof config['onStart'] == 'function') {
    // onStartFuncDef = serialize(config['onStart']);
    // const rpcFunc = wire.createRPC(wire.toAsync(function(...args) {
    //   console.log('Child Node started successfully, without callback'+args);
    //   cb(null, ...args);
    // }));
    // const newFunc = function(server, callback) {
    //   const givenStartFunc = serialization.deserialize(onStartFuncDef);
    //   givenStartFunc(server);
    //   // onStartFunc(server);
    //   rpcFunc(server, callback);
    // };
    // config['onStart'] = newFunc;

    funcStr = `
let onStart = ${config['onStart'].toString()};
let callbackRPC = ${wire.createRPC(wire.toAsync(cb)).toString()};
onStart();
callbackRPC(null, global.nodeConfig, () => {});
`;
    config['onStart'] = new Function(funcStr)();
    // onStartFuncDef = serialize(config['onStart']);
  } else {
    config['onStart'] = wire.createRPC(wire.toAsync(function(...args) {
      console.log('Child Node started successfully, without callback'+args);
      cb(null, ...args);
    }));
  }


  // childProcess.fork(path.join(__dirname, '../../distribution.js'),
  //     [serialization.serialize(config)]);
  // console.log('Path generated here is : '+
  //   path.join(__dirname, '../../distribution.js'));
  // childProcess.spawn('node',
  //     ['../../distribution.js', '--config', serialization.serialize(config)],
  //     {detached: true, stdio: 'inherit'});

  let serializedConfig = serialize(config);
  // serializedConfig = serializedConfig.
  // replace('onStartFuncDef', onStartFuncDef.replace('"', '\\"'));

  childProcess.spawn('node', [path.join(__dirname, '../../distribution.js'),
    '--config', serializedConfig]);

  // , '--onStartFuncDef', onStartFuncDef

  // cp.on('error', (error) => {
  //   console.error('Error in child process:', error);
  // });
  // cp.on('message', (message) => {
  //   console.log('Message from child process:', message);
  // });
};


module.exports = status;
