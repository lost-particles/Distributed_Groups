const id = require('../util/id');
// const childProcess = require('child_process');
const {spawn} = require('node:child_process');
const wire = require('../util/wire.js');
const serialization = require('../util/serialization.js');
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
  setTimeout(() => {
    console.log('Stopping the node');
    process.exit(0);
  }, 500);
  callback(null, 'Exited Gracefully');
};

status.spawn = function(config, cb=(e, v)=>{}) {
  let onStartFunc;
  if (typeof config['onStart'] == 'function') {
    onStartFunc = config['onStart'];
    config['onStart'] = wire.createRPC(wire.toAsync(function(...args) {
      onStartFunc();
      cb(null, ...args);
    }));
  } else {
    config['onStart'] = wire.createRPC(wire.toAsync(function(...args) {
      console.log('Child Node started successfully, without callback'+args);
      cb(null, ...args);
    }));
  }
  // const cp = childProcess.fork(path.join(__dirname, '../../distribution.js'),
  //     [serialization.serialize(config)]);
  // console.log('Path generated here is : '+
  //   path.join(__dirname, '../../distribution.js'));
  // const cp = childProcess.spawn('node',
  //     ['../../distribution.js', '--config', serialization.serialize(config)],
  //     {detached: true, stdio: 'inherit'});

  // spawn('node', [path.join(__dirname, '../distribution.js'),
  //   '--config', serialization.serialize(config)]);

  // cp.on('error', (error) => {
  //   console.error('Error in child process:', error);
  // });
  // cp.on('message', (message) => {
  //   console.log('Message from child process:', message);
  // });
};


module.exports = status;
