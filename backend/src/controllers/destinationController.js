const db = require('../config/db');

// Get all destinations
const getAllDestinations = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM destinations ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single destination by ID
const getDestinationById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM destinations WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Destination not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllDestinations, getDestinationById };
