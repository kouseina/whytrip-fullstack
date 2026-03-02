const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Destination logic
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);

module.exports = router;
