allComm = require('./comm.js');
localStatus = require('../local/status');
localGroups = require('../local/groups.js');
allGroups = require('./groups.js');
id = require('../util/id');

let status = (config) => {
  let context = {};
  context.gid = config.gid || 'all'; // contains a property named gid
  return {
    get: function(key, callback=(e, v)=>{}) {
      let processedResponse = {};
      const remote = {service: 'status', method: 'get'};
      const message = [key];
      global.distribution[context.gid].comm.send(message, remote, (groupErrors, response)=>{
        if (key in ['counts', 'heapTotal', 'heapUsed']) {
          processedResponse[key]=0;
          response.forEach((eachKey)=>{
            processedResponse[key]+=response.get(eachKey);
          });
        } else {
          processedResponse = response;
        }
        callback(groupErrors, processedResponse);
      });
    },

    stop: function(callback) {
      const remote = {service: 'status', method: 'stop'};
      const message = [];
      global.distribution[context.gid].comm.send(message, remote, (e, v)=>{
        setTimeout(() => {
          console.log('Stopping the node');
          // process.exit(0);
          callback(e, v);
        }, 1000);
      });
    },

    spawn: function(spawnConfig, callback) {
      localStatus.spawn(spawnConfig, (e, v)=>{
        localGroups.get(context.gid, (e, v)=>{
          const thisNode = {};
          const spawnObj = {ip: spawnConfig['ip'],
            port: spawnConfig['port']};
          const spawnObjHash = id.getSID(spawnObj);
          thisNode[spawnObjHash] = spawnConfig;
          allGroups(context).put(context.gid, {...v, ...thisNode}, (e, v)=>{
            if (Object.keys(e).length === 0 ||
              !e.hasOwnProperty(spawnObjHash)) {
              callback(null, v[spawnObjHash][spawnObjHash]);
            } else {
              callback(e[spawnObjHash],
                  v[spawnObjHash][spawnObjHash]);
            }
          });
        });
      });


      // const remote = {service: 'status', method: 'spawn'};
      // const message = [spawnConfig];
      // global.distribution[context.gid].comm.send(message, remote, (e, v)=>{
      //   callback(e, v);
      // });
    },

  };
};


module.exports=status;
