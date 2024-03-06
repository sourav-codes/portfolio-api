const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/portfolioDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/portfolio', portfolioRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
