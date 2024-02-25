const id = require('../util/id');
const childProcess = require('child_process');
const wire = require('../util/wire.js');
const serialization = require('../util/serialization.js');

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

status.stop = function(callback=console.log) {
  setTimeout(() => {
    console.log('Stopping the node');
    process.exit();
  }, 1000);
  callback(null, 'Exited Gracefully');
};

status.spawn = function(config, callback=console.log) {
  let onStartFunc;
  if (typeof config['onStart'] == 'function') {
    onStartFunc = config['onStart'];
    config['onStart'] = wire.createRPC(wire.toAsync(function() {
      onStartFunc();
      callback(null, 'Child Node started successfully');
    }));
  } else {
    config['onStart'] = wire.createRPC(wire.toAsync(function() {
      callback(null, 'Child Node started successfully');
    }));
  }
  cp = childProcess.fork('../distribution.js', serialization.serialize(config));
};


module.exports = status;
