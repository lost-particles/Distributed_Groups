allComm = require('./comm.js');

let routes = (config) => {
  let context = {};
  context.gid = config.gid || 'all'; // contains a property named gid
  return {
    put: function(serviceObj, serviceName, callback=(e, v)=>{}) {
      const remote = {service: 'routes', method: 'put'};
      const message = [serviceObj, serviceName];
      global.distribution[context.gid].comm.send(message, remote, callback);
    },
  };
};

module.exports = routes;
