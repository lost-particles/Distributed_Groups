
global.nodeConfig = {ip: '127.0.0.1', port: 8080};
const distribution = require('../distribution');
const id = distribution.util.id;

const groupsTemplate = require('../distribution/all/groups');
const {serialize} = require('../distribution/util/util.js');
const mygroupGroup = {};

/*
   This hack is necessary since we can not
   gracefully stop the local listening node.
   This is because the process that node is
   running in is the actual jest process
*/
let localServer = null;

beforeAll((done) => {
  const n1 = {ip: '127.0.0.1', port: 8000, onStart: (server)=>{
    console.log('Hey this is me');
  }};
  const n2 = {ip: '127.0.0.1', port: 8001};
  const n3 = {ip: '127.0.0.1', port: 8002};

  // First, stop the nodes if they are running
  let remote = {service: 'status', method: 'stop'};
  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
      });
    });
  });

  mygroupGroup[id.getSID(n1)] = n1;
  mygroupGroup[id.getSID(n2)] = n2;
  mygroupGroup[id.getSID(n3)] = n3;

  // Now, start the base listening node
  distribution.node.start((server) => {
    localServer = server;
    // Now, start the nodes
    distribution.local.status.spawn(n1, (e, v) => {
      distribution.local.status.spawn(n2, (e, v) => {
        distribution.local.status.spawn(n3, (e, v) => {
          groupsTemplate({gid: 'mygroup'})
              .put('mygroup', mygroupGroup, (e, v) => {
                done();
              });
        });
      });
    });
  });
});

afterAll((done) => {
  distribution.mygroup.status.stop((e, v) => {
    const nodeToSpawn = {ip: '127.0.0.1', port: 8008};
    let remote = {node: nodeToSpawn, service: 'status', method: 'stop'};
    distribution.local.comm.send([], remote, (e, v) => {
      localServer.close();
      done();
    });
  });
});


test('(2 pts) all.groups.put/add/get(browncs)', (done) => {
  let g = {
    '755b7': {ip: '127.0.0.1', port: 8001},
  };


  distribution.mygroup.groups.put('browncs', {ip: '127.0.0.1', port: 8080},
      (e, v) => {
        distribution.mygroup.groups.add('browncs',
            {ip: '127.0.0.1', port: 8001},
            (e, v) => {
              distribution.mygroup.groups.get('browncs', (e, v) => {
                expect(e).toEqual({});
                Object.keys(mygroupGroup).forEach((sid) => {
                  expect(v[sid]['755b7']).toEqual(g['755b7']);
                });
                done();
              });
            });
      });
});

test('(2 pts) all.groups.put/add/rem(browncs)', (done) => {
  let g = {
    '755b7': {ip: '127.0.0.1', port: 8001},
  };


  distribution.mygroup.groups.put('browncs', {ip: '127.0.0.1', port: 8080},
      (e, v) => {
        distribution.mygroup.groups.add('browncs',
            {ip: '127.0.0.1', port: 8001},
            (e, v) => {
              distribution.mygroup.groups.rem('browncs',
                  {ip: '127.0.0.1', port: 8001}, (e, v)=>{
                    distribution.mygroup.groups.get('browncs', (e, v) => {
                      expect(e).toEqual({});
                      Object.keys(mygroupGroup).forEach((sid) => {
                        expect(v[sid]['755b7']).toBeFalsy();
                      });
                      done();
                    });
                  });
            });
      });
});

test('(2 pts) all.groups.put/add/get(browncs)', (done) => {
  let g = {
    '755b7': {ip: '127.0.0.1', port: 8001},
  };


  distribution.mygroup.groups.put('browncs', {ip: '127.0.0.1', port: 8080},
      (e, v) => {
        distribution.mygroup.groups.add('browncs',
            {ip: '127.0.0.1', port: 8001},
            (e, v) => {
              distribution.mygroup.groups.get('browncs', (e, v) => {
                expect(e).toEqual({});
                Object.keys(mygroupGroup).forEach((sid) => {
                  expect(v[sid]['755b7']).toEqual(g['755b7']);
                });
                done();
              });
            });
      });
});

test('(0 pts) sample test', () => {
  const t = true;
  expect(t).toBe(true);
});
test('(0 pts) sample test', () => {
  const t = true;
  expect(t).toBe(true);
});
test('(0 pts) sample test', () => {
  const t = true;
  expect(t).toBe(true);
});
test('(0 pts) sample test', () => {
  const t = true;
  expect(t).toBe(true);
});
