const WebSocket = require('ws');

const port = 8080;
const wssRegister = new WebSocket.Server({ port: port });
console.log("Mock server started on port " + port + "...");

wssRegister.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('{ "protocol" : "candy-rush-protocol", "source" : "server", "method": "registration", "value": "1234"}');
});