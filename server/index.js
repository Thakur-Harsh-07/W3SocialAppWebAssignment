const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();
const cors = require("cors");
const app = express();



const PORT = process.env.PORT || 4000;

// Connect to the database
connectDB();

// CORS configuration 
app.use(
	cors({
		origin: "*",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json());

// Import routes
const userRoutes = require('./routes/User');
const postRoutes = require('./routes/Post');

// Routes
app.use('/api/v1', userRoutes); // User authentication routes (signup, login)
app.use('/api/v1/post', postRoutes); // Post, comment, and like routes

app.get('/', (req, res) => {
    res.send('Backend  is running...');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});