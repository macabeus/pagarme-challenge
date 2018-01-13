const app = require('express')();
const server = require('http').Server(app);
const socket = require('./Network/socket');
const routes = require('./Network/routes');

app.use(routes);
socket.attach(server);

server.listen(3001);
