const express = require('express');
const {
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByCaregiverId,
  getReviewsByUserId,
  getAverageRatingByUserId,
} = require('../controllers/reviewController');

const router = express.Router();

// Create a review
router.post('/create-review', createReview);

// Get a review by review_id
router.get('/get-review/:id', getReviewById);

// Update a review by review_id
router.put('/update-review/:id', updateReview);

// Delete a review by review_id
router.delete('/delete-review/:id', deleteReview);

// Get all reviews for a specific caregiver
router.get('/get-review-by-caregiver/:caregiver_id', getReviewsByCaregiverId);

// Get all reviews for a specific caregiver
router.get('/get-review-by-user/:user_id', getReviewsByUserId);

router.post('/get-average-rating', getAverageRatingByUserId);

module.exports = router;
