//
//
// let gossip = (config) => {
//   let context = {};
//   context.gid = config.gid || 'all'; // contains a property named gid
//   return {send: () => {/** uses context **/}};
// };
//
// module.exports = gossip;

let gossip = (config) => {
  let context = {}; // create service-local context.
  context.gid = config.gid || 'all';
  context.subset = config.subset || 3;
  return {send: (args, remote, cb) => {
    cb({}, {});
  }, at: () => {}, del: () => {}};
};

module.exports = gossip;
