const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const API_KEY = process.env.API_KEY;
    const API_URL = 'https://www.balldontlie.io/api/v1';

    const { endpoint, ...queryParams } = req.query;
    const queryString = new URLSearchParams(queryParams).toString();

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key is not configured.' });
    }

    try {
        const response = await fetch(`${API_URL}/${endpoint}?${queryString}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
};