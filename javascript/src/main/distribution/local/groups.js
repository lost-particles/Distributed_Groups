id = require('../util/id.js');
distribution = require('../../distribution');
const path = require('path');

const groups = {
  groupMapping: new Map(),
  get: function(key, callback=console.log) {
    if (this.groupMapping.has(key)) {
      callback(null, this.groupMapping.get(key));
    } else {
      callback(new Error('Group key not found'));
    }
  },
  put: function(key, group, callback=console.log) {
    if (distribution[key]===undefined) {
      distribution[key]={'comm': require(path.join(__dirname, '../all/comm.js'))({gid: key}),
        'status': require(path.join(__dirname, '../all/status.js') )({gid: key}),
        'groups': require(path.join(__dirname, '../all/groups') )({gid: key}),
        'routes': require(path.join(__dirname, '../all/routes.js') )({gid: key}),
        'gossip': require(path.join(__dirname, '../all/gossip.js') )({gid: key})};
    }
    if (this.groupMapping.has(key)) {
      this.groupMapping.set(key, {...this.groupMapping.get(key), ...group});
    } else {
      this.groupMapping.set(key, group);
    }
    callback(null, this.groupMapping.get(key));
  },
  del: function(key, callback=console.log) {
    const deletedGroup = this.groupMapping.get(key);
    const result = this.groupMapping.delete(key);
    if (result) {
      callback(null, deletedGroup);
    } else {
      callback(new Error('Group key not found. No operation was performed'));
    }
  },
  add: function(key, node, callback=console.log) {
    if (this.groupMapping.has(key)) {
      this.groupMapping.get(key)[id.getSID(node)]=node;
      // callback(null, 'Successfully added to the group');
    } // else {
    //  callback(null, 'Group not found');
    // }
    callback(null, this.groupMapping.get(key));
  },
  rem: function(key, nodeSID, callback=console.log) {
    const deletedNode = this.groupMapping.get(key);
    if (this.groupMapping.has(key)) {
      Reflect.deleteProperty(this.groupMapping.get(key), nodeSID);
    } else {
      callback(new Error('Node not found.'));
    }
    callback(null, deletedNode);
  },
};

module.exports=groups;
