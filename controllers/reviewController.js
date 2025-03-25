const db = require('../config/database');
const { format } = require('date-fns');

// Create Review
async function createReview(req, res) {
    try {
        const { caregiver_id, client_id, rating, comment } = req.body;

        if (!caregiver_id || !client_id || rating === undefined) {
            return res.status(400).json({ error: "caregiver_id, client_id, and rating are required." });
        }

        const review_time = new Date();

        await db('Review').insert({
            caregiver_id,
            client_id,
            rating,
            comment,
            review_time
        });

        return res.status(201).json({ message: "Review created successfully." });
    } catch (error) {
        console.error("Error creating review:", error);
        return res.status(500).json({ error: "Failed to create review." });
    }
}

// Get Review by ID
async function getReviewById(req, res) {
    try {
        const review = await db('Review').where({ review_id: req.params.id }).first();

        if (!review) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        const formattedReview = {
            ...review,
            review_time: review.review_time
                ? format(new Date(review.review_time), 'dd-MM-yyyy HH:mm:ss')
                : null,
        };

        return res.status(200).json(formattedReview);
    } catch (error) {
        console.error("Error retrieving review:", error);
        return res.status(500).json({ error: "Failed to retrieve review." });
    }
}

// Update Review
async function updateReview(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Review ID is required.' });
        }

        const updateFields = Object.entries(updateData).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        const updatedRows = await db('Review').where({ review_id: id }).update(updateFields);

        if (!updatedRows) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        return res.status(200).json({
            message: 'Review updated successfully.',
            updatedFields: updateFields
        });
    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({ error: "Failed to update review." });
    }
}

// Delete Review
async function deleteReview(req, res) {
    try {
        const deletedRows = await db('Review').where({ review_id: req.params.id }).del();

        if (!deletedRows) {
            return res.status(404).json({ error: 'Review not found.' });
        }

        return res.status(200).json({ message: 'Review deleted successfully.' });
    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ error: "Failed to delete review." });
    }
}

// Get all reviews for a specific caregiver
async function getReviewsByCaregiverId(req, res) {
    try {
        const { caregiver_id } = req.params;

        const reviews = await db('Review')
            .where({ caregiver_id })
            .select('review_id', 'client_id', 'rating', 'comment', 'review_time');

        const formattedReviews = reviews.map(review => ({
            ...review,
            review_time: review.review_time
                ? format(new Date(review.review_time), 'dd-MM-yyyy HH:mm:ss')
                : null,
        }));

        return res.status(200).json(formattedReviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return res.status(500).json({ error: "Failed to fetch reviews." });
    }
}

// Get all reviews for a caregiver using user_id
async function getReviewsByUserId(req, res) {
    try {
      const { user_id } = req.params;
  
      // Step 1: Find caregiver_id from user_id
      const caregiver = await db('Caregiver')
        .where({ user_id })
        .select('caregiver_id')
        .first();
  
      if (!caregiver) {
        return res.status(404).json({ error: 'Caregiver not found for this user_id.' });
      }
  
      const caregiver_id = caregiver.caregiver_id;
  
      // Step 2: Get all reviews by caregiver_id
      const reviews = await db('Review')
        .where({ caregiver_id })
        .select('review_id', 'client_id', 'rating', 'comment', 'review_time');
  
      // Step 3: Enrich reviews with alias from Users
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          // Find user_id from Client table using client_id
          const client = await db('Client')
            .where({ client_id: review.client_id })
            .select('user_id')
            .first();
  
          let alias = 'ไม่ทราบชื่อ';
  
          if (client) {
            const user = await db('Users')
              .where({ user_id: client.user_id })
              .select('alias')
              .first();
  
            if (user?.alias) {
              alias = user.alias;
            }
          }
  
          return {
            ...review,
            alias,
            review_time: review.review_time
              ? format(new Date(review.review_time), 'dd-MM-yyyy HH:mm:ss')
              : null,
          };
        })
      );
  
      return res.status(200).json(enrichedReviews);
    } catch (error) {
      console.error('Error fetching reviews by user_id:', error);
      return res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
  }

// POST: Get average rating using user_id (by looking up caregiver_id first)
async function getAverageRatingByUserId(req, res) {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "user_id is required." });
        }

        // Step 1: Find caregiver_id from user_id
        const caregiver = await db('Caregiver')
            .where({ user_id })
            .select('caregiver_id')
            .first();

        if (!caregiver) {
            return res.status(404).json({ error: "Caregiver not found for the given user_id." });
        }

        const caregiver_id = caregiver.caregiver_id;

        // Step 2: Get average rating by caregiver_id
        const result = await db('Review')
            .where({ caregiver_id })
            .avg('rating as average');

        const average = result[0].average;

        if (average === null || average === undefined) {
            return res.status(200).json({ caregiver_id, average_rating: null });
        }

        const roundedAverage = parseFloat(parseFloat(average).toFixed(1));

        return res.status(200).json({ caregiver_id, average_rating: roundedAverage });
    } catch (error) {
        console.error("Error fetching average rating by user_id:", error);
        return res.status(500).json({ error: "Failed to fetch average rating." });
    }
}

module.exports = {
    createReview,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByCaregiverId,
    getReviewsByUserId,
    getAverageRatingByUserId,
};
