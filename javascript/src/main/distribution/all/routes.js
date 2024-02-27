allComm = require('./comm.js');

let routes = (config) => {
  let context = {};
  context.gid = config.gid || 'all'; // contains a property named gid
  return {
    put: function(serviceObj, serviceName, callback=console.log) {
      const remote = {service: 'routes', method: 'put'};
      const message = [serviceObj, serviceName];
      allComm(context).send(message, remote, callback);
    },
  };
};

module.exports = routes;
