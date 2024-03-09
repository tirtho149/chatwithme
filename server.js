const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./db');
const Message = require('./models/Message');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB(); // Connect to MongoDB

app.use(express.static('public')); // Serve static files from 'public' directory

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('sendMessage', async (data) => {
    const message = new Message({ username: data.username, message: data.message });
    await message.save();
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
