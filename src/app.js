require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const connectDB = require('./src/db/mongoose');
const { Server } = require('socket.io');
const { initializeSocket } = require('./src/sockets/socket');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO (adjust CORS for production as needed)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Set up Socket.IO events
initializeSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
