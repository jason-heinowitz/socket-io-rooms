const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  const { address, port } = socket.request.connection._peername;
  console.log(`User Connected [${address}:${port}]`);
  let currentRoom = 'Waiting Room';

  socket.on('message-out', (msg) => {
    io.in(currentRoom).emit('message', msg);
    console.log(`Sent to all: ${msg}`);
  });

  socket.on('join room', (roomToJoin) => {
    socket.leave(currentRoom);
    socket.join(roomToJoin);
    currentRoom = roomToJoin;
    console.log(`User joined: ${currentRoom}`);
  });

  socket.on('disconnect', () => {
    // io.emit('message', 'User disconnected');
    console.log('User disconnected');
  });
});

io.listen(3000);
