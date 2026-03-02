const express = require('express');
const router = express.Router({ mergeParams: true }); // Allows access to params from parent router
const { getReviewsByDestinationId, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getReviewsByDestinationId);
router.post('/', protect, createReview);

module.exports = router;
