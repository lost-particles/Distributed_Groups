

let gossip = (config) => {
  let context = {};
  context.gid = config.gid || 'all'; // contains a property named gid
  return {get: () => {/** uses context **/},
    stop: () => {/** uses context**/}};
};

module.exports = gossip;
