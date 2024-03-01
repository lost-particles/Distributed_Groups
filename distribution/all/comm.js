groups = require('./groups.js');
localGroups = require('../local/groups.js');
localComm = require('../local/comm.js');

let comm = (config) => {
  let context = {};
  context.gid = config.gid || 'all'; // contains a property named gid
  return {
    send: function(params, remote, callback=(e, v)=>{}) {
      try {
        localGroups.get(context.gid, (e, groupObj)=>{
          if (e!=null) {
            callback(e);
          }
          const groupCount = Object.keys(groupObj).length;
          let responseCount = 0;
          const groupResponse = new Map();
          const groupErrors = new Map();
          Object.entries(groupObj).forEach(([key, value])=>{
            let eachRemote = {...remote, ...{'node': value}};
            localComm.send(params, eachRemote, (e, v)=>{
              responseCount++;
              if (e!=null) {
                groupErrors.set(key, e);
              } else {
                groupResponse.set(key, v);
              }
              if (responseCount===groupCount) {
                callback(Object.fromEntries(groupErrors),
                    Object.fromEntries(groupResponse));
              }
            });
          });
        });
      } catch (e) {
        callback(e);
      }
    },
  };
};

module.exports = comm;
