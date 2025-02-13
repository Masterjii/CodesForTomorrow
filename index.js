require('dotenv').config();
const http = require('http');
const cookieParser = require('cookie-parser');
const express = require('express');
const connectDB = require('./src/db/mongoose');
const authRoutes = require('./src/routes/auth.routes');
const resourceRoutes = require('./src/routes/resource.route');
const { Server } = require('socket.io');
const { initializeSocket } = require('./src/sockets/socket');

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON, URL-encoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount authentication routes
app.use(authRoutes);
app.use(resourceRoutes);

// Create the HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings (adjust for production as needed)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach Socket.IO instance to the Express app for later use in controllers
app.set('io', io);

// Initialize Socket.IO events (with JWT authentication and room support)
initializeSocket(io);

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
