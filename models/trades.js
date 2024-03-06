const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
   stockId: { type: String, required: true },
   date: { type: Date, required: true },
   type: { type: String, enum: ['buy', 'sell'], required: true },
   quantity: { type: Number, required: true },
   price: { type: Number, required: true }
});

module.exports = mongoose.model('Trade', tradeSchema);
