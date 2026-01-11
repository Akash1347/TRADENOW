const axios = require("axios");

module.exports.candleChart = async (req, res) => {
    try {
        const symbol = req.params.symbol;

        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;

        const response = await axios.get(url);

        res.json(response.data);
    } catch (error) {
        console.error("Yahoo API error:", error.message);
        res.status(500).json({ error: "Failed to fetch chart data" });
    }
};
