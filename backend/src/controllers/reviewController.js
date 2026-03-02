const db = require('../config/db');

// Get all reviews across all destinations (for homepage)
const getAllReviews = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all reviews for a destination
const getReviewsByDestinationId = async (req, res) => {
    const { destinationId } = req.params;

    try {
        const result = await db.query(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.destination_id = $1
            ORDER BY r.created_at DESC
        `, [destinationId]);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new review
const createReview = async (req, res) => {
    const { destinationId } = req.params;
    const { rating, comment } = req.body;

    // Assumes auth middleware populates req.user
    const userId = req.user.id;

    try {
        const newReview = await db.query(
            'INSERT INTO reviews (user_id, destination_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, destinationId, rating, comment]
        );

        res.status(201).json(newReview.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while creating review' });
    }
};

module.exports = { getReviewsByDestinationId, createReview, getAllReviews };
