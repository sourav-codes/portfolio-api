const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
   trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }]
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
