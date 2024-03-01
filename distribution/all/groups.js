id = require('../util/id.js');
allComm = require('./comm.js');
localGroups = require('../local/groups.js');

let groups = (serviceConfig) => {
  let context = {};
  context.gid = serviceConfig.gid || 'all'; // contains a property named gid
  return {
    get: function(key, callback=(e, v)=>{}) {
      const remote = {service: 'groups', method: 'get'};
      const message = [key];
      allComm(context).send(message, remote, callback);
    },
    put: function(key, group, callback=(e, v)=>{}) {
      localGroups.put(key, group, (e, v)=>{
        if (e!=null) {
          callback(e);
        } else {
          const remote = {service: 'groups', method: 'put'};
          const message = [key, group];
          allComm(context).send(message, remote, callback);
        }
      });
    },
    del: function(key, callback=(e, v)=>{}) {
      const remote = {service: 'groups', method: 'del'};
      const message = [key];
      allComm(context).send(message, remote, callback);
    },
    add: function(key, node, callback=(e, v)=>{}) {
      const remote = {service: 'groups', method: 'add'};
      const message = [key, node];
      allComm(context).send(message, remote, callback);
    },
    rem: function(key, nodeSID, callback=(e, v)=>{}) {
      const remote = {service: 'groups', method: 'rem'};
      const message = [key, nodeSID];
      allComm(context).send(message, remote, callback);
    },
  };
};

module.exports=groups;
