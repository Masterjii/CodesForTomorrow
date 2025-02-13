// src/sockets/socket.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const initializeSocket = (io) => {
  // Middleware for authenticating socket connections using JWT
  io.use(async (socket, next) => {
    try {
      // Token can be provided in handshake.auth or query parameters
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error("Authentication error: Token missing"));
      }
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Check the user in the database to verify session (single session enforcement)
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }
      if (user.currentSessionId !== decoded.sessionId) {
        return next(new Error("Authentication error: Session invalid"));
      }
      // Attach user data to the socket for later use
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: " + error.message));
    }
  });

  // Set up connection event after authentication
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id, 'User:', socket.user.username);

    // If the client provides a room (via handshake query), join that room
    const room = socket.handshake.query.room;
    if (room) {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    }

    // Listen for messages from the client and broadcast them
    socket.on('clientMessage', (data) => {
      console.log(`Message from ${socket.id}:`, data);
      const messagePayload = {
        user: socket.user.username,
        message: data
      };
      // If a room is defined, broadcast to that room; otherwise, to all clients
      if (room) {
        io.to(room).emit('serverMessage', messagePayload);
      } else {
        io.emit('serverMessage', messagePayload);
      }
    });

    // Allow client to join additional rooms (for resource-specific updates, etc.)
    socket.on('joinRoom', (roomName) => {
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = { initializeSocket };
