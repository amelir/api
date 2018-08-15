const chokidar = require('chokidar');
const debug = require('debug')('app');
const path = require('path');
const schemas = require('schemas');

// Load environmental variables
require('dotenv').config();

const state = {
  server: null,
  sockets: []
}

schemas.init()
  .then(() => {
    start();
    chokidar.watch(['./server.js', './routes', './utils'])
      .on('all', (event, at) => {
        if(event === 'change'){
          debug('Changes at', at);
          restart();
        }
      });
  })
  .catch(debug);

function start(){
  // Start API server
  state.server = require('./server')()
    .listen(process.env.PORT, () => debug('API started on port', process.env.PORT));

  state.server.on('connection', socket => {
    state.sockets.push(socket)
  });
}

function restart(){
  // Clear require cache
  Object.keys(require.cache).forEach(id => {
    if(checkPath(id)){
      debug('Reloading', id);
      delete require.cache[id];
    }
  });

  state.sockets.forEach(socket => {
    if(socket.destroyed === false){
      socket.destroy();
    }
  });

  state.sockets = [];

  state.server.close(() => {
    debug('\n---restarting server---');
    start();
  });
}

function checkPath(id){
  return (
    id.startsWith(path.join(__dirname, 'routes')) ||
    id.startsWith(path.join(__dirname, 'utils')) ||
    id.startsWith(path.join(__dirname, 'server.js'))
  );
}