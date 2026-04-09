require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { Server } = require('socket.io');
const connectDB = require('./config/db');
const initializeFirebase = require('./config/firebase');
const logger = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const socketService = require('./services/socketService');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Security & Performance Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());

// Rate Limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: process.env.NODE_ENV === 'development' ? 10000 : 100, // Relax in dev
// });
// app.use('/api', limiter);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initialize Socket Service
socketService(io);
app.set('socketio', io);

// Connect to Database
connectDB();

// Initialize Firebase
initializeFirebase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// API Routes
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/tables', require('./routes/tableRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Static Folders
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Create uploads folder if not exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*splat', (req, res) =>
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('Restaurant API is running...');
    });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = { app, server, io };
