var WebSocketServer = require('ws').Server;
var port = 9090;
var wss = new WebSocketServer({ port: port });
var history = [];

wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(message) {
    wss.broadcast(message);
    history.push(message);
    console.log(message);
  });
  
  ws.send('on');
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

console.log('Web Socket running on port: ' + port + '...' );