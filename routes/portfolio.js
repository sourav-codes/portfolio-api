const express = require('express');
const router = express.Router();
const Trade = require('../models/trades');
const Portfolio = require('../models/portfolio');

// Retrieve the portfolio
router.get('/', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({}).populate('trades');
        res.json({ success: true, data: portfolio });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add a trade
router.post('/addTrade', async (req, res) => {
    const trade = new Trade(req.body);
    try {
        const savedTrade = await trade.save();
        await Portfolio.findOneAndUpdate({}, { $push: { trades: savedTrade._id } });
        res.json({ success: true, data: savedTrade });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update a trade
router.post('/updateTrade', async (req, res) => {
    const { id, ...update } = req.body;
    try {
        const updatedTrade = await Trade.findByIdAndUpdate(id, update, { new: true });
        if (!updatedTrade) {
            return res.status(404).json({ success: false, message: "Trade not found" });
        }
        res.json({ success: true, data: updatedTrade });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Remove a trade
router.post('/removeTrade', async (req, res) => {
    const { id } = req.body;
    try {
        await Trade.findByIdAndDelete(id);
        await Portfolio.findOneAndUpdate({}, { $pull: { trades: id } });
        res.json({ success: true, message: "Trade removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/holdings', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({}).populate('trades');
        if (!portfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }

        const holdings = {};
        portfolio.trades.forEach(trade => {
            if (!holdings[trade.stockId]) {
                holdings[trade.stockId] = { quantity: 0, totalCost: 0 };
            }

            if (trade.type === 'buy') {
                holdings[trade.stockId].quantity += trade.quantity;
                holdings[trade.stockId].totalCost += trade.quantity * trade.price;
            } else if (trade.type === 'sell') {
                holdings[trade.stockId].quantity -= trade.quantity;
                holdings[trade.stockId].totalCost -= trade.quantity * trade.price;
            }
        });

        const holdingView = Object.keys(holdings).map(stockId => ({
            stockId,
            quantity: holdings[stockId].quantity,
            averagePrice: holdings[stockId].totalCost / holdings[stockId].quantity
        }));

        res.json({ success: true, data: holdingView });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/returns', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({}).populate('trades');
        if (!portfolio) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }

        let totalInvestment = 0;
        let totalValue = 0;

        portfolio.trades.forEach(trade => {
            if (trade.type === 'buy') {
                totalInvestment += trade.quantity * trade.price;
            } else if (trade.type === 'sell') {
                totalValue += trade.quantity * 100; // Assuming final price is 100
            }
        });

        const cumulativeReturn = (totalValue - totalInvestment) / totalInvestment;

        res.json({ success: true, data: { cumulativeReturn } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router;
