allComm = require('./comm.js');
localStatus = require('../local/status');
allGroups = require('./groups');

let status = (config) => {
  let context = {};
  context.gid = config.gid || 'all'; // contains a property named gid
  return {
    get: function(key, callback=(e, v)=>{}) {
      let processedResponse = {};
      const remote = {service: 'status', method: 'get'};
      const message = [key];
      allComm(context).send(message, remote, (groupErrors, response)=>{
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

    stop: function() {
      const remote = {service: 'status', method: 'stop'};
      const message = [];
      allComm(context).send(message, remote, (e, v)=>{
        setTimeout(() => {
          console.log('Stopping the node');
          // process.exit(0);
        }, 1000);
      });
    },

    spawn: function(spawnConfig, callback) {
      // localStatus.spawn(spawnConfig, (e, v)=>{
      //   allGroups(context).add(context.gid, spawnConfig, (e, v)=>{
      //     callback(e, v);
      //   });
      // });


      const remote = {service: 'status', method: 'spawn'};
      const message = [spawnConfig];
      allComm(context).send(message, remote, (e, v)=>{
        callback(e, v);
      });
    },

  };
};


module.exports=status;
