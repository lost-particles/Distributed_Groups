id = require('../util/id.js');
allComm = require('./comm.js');

const groups = {
  get: function(key, callback=console.log) {
    const remote = {service: 'groups', method: 'get'};
    const message = [key];
    allComm.send(message, remote, callback);
  },
  put: function(key, group, callback=console.log) {
    const remote = {service: 'groups', method: 'put'};
    const message = [key, group];
    allComm.send(message, remote, callback);
  },
  del: function(key, callback=console.log) {
    const remote = {service: 'groups', method: 'del'};
    const message = [key];
    allComm.send(message, remote, callback);
  },
  add: function(key, node, callback=console.log) {
    const remote = {service: 'groups', method: 'add'};
    const message = [key, node];
    allComm.send(message, remote, callback);
  },
  rem: function(key, nodeSID, callback=console.log) {
    const remote = {service: 'groups', method: 'rem'};
    const message = [key, nodeSID];
    allComm.send(message, remote, callback);
  },
};

module.exports=groups;
