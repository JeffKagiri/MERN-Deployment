// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Import API routes
const tasksRouter = require('./routes/tasks');

// Mount API routes
app.use('/api/tasks', tasksRouter);

// Health check route for Azure
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from React build folder
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    // Handle client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// Set server port from environment variable or default to 8080 for Azure
const PORT = process.env.PORT || 8080;

// Start the server (Azure requires 0.0.0.0 binding)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
