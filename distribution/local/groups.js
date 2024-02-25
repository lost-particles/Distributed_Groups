id = require('../util/id.js');

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
    if (this.groupMapping.has(key)) {
      this.groupMapping.set(key, {...this.groupMapping.get(key), ...group});
    } else {
      this.groupMapping.set(key, group);
    }
    callback(null, this.groupMapping.get(key));
  },
  del: function(key, callback=console.log) {
    const deletedGroup = this.groupMapping.get(key);
    this.groupMapping.delete(key);
    callback(null, deletedGroup);
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
  rem: function(key, nodeSID, callback) {
    const deletedNode = this.groupMapping.get(key);
    if (this.groupMapping.has(key)) {
      delete Reflect.get(this.groupMapping.get(key), nodeSID);
    }
    callback(null, deletedNode);
  },
};

module.exports=groups;
