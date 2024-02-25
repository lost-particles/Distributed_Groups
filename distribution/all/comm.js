groups = require('./groups.js');
localComm = require('../local/comm.js');

const comm={
  send: function(params, remote, callback=console.log) {
    try {
      groups.get('all', (e, groupObj)=>{
        if (e!=null) {
          callback(e);
        }
        const groupCount = Object.keys(groupObj).length;
        let responseCount = 0;
        const groupResponse = new Map();
        Object.entries(groupObj).forEach((key)=>{
          let eachRemote = {...remote, ...{'node': groupObj[key]}};
          localComm.send(params, eachRemote, (e, v)=>{
            responseCount++;
            if (e!=null) {
              groupResponse.add(key, e);
            } else {
              groupResponse.add(key, v);
            }
            if (responseCount===groupCount) {
              callback(null, groupResponse);
            }
          });
        });
      });
    } catch (e) {
      callback(e);
    }
  },
};

module.exports = comm;
