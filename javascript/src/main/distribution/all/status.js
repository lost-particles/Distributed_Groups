allComm = require('./comm.js');

let status = (config) => {
  let context = {};
  context.gid = config.gid || 'all'; // contains a property named gid
  return {
    get: function(key, callback=console.log) {
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
          process.exit();
        }, 1000);
      });
    },

    spawn: function(spawnConfig, callback) {
      const remote = {service: 'status', method: 'spawn'};
      const message = [];
      allComm(context).send(message, remote, (e, v)=>{
        callback(e, v);
      });
    },

  };
};


module.exports=status;
