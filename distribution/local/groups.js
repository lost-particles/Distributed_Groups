
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
    callback(null, 'Added group to group mapping');
  },
  del: function(key, callback=console.log) {
    const result = this.groupMapping.delete(key);
    if (result) {
      callback(null, 'Group was deleted successfully');
    } else {
      callback(new Error('Group not found. No operation was performed'));
    }
  },
  add: function(key, node) {
    if (this.groupMapping.has(key)) {
      this.groupMapping.get(key)[id.getSID(node)]=node;
      // callback(null, 'Successfully added to the group');
    } // else {
    //  callback(null, 'Group not found');
    // }
  },
  rem: function(key, nodeSID) {
    if (this.groupMapping.has(key)) {
      delete Reflect.get(this.groupMapping.get(key), nodeSID);
    }
  },
};

module.exports=groups;
