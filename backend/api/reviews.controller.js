import ReviewsDataAccessObject from "../dao/reviewsDAO.js";

export default class ReviewsController {
	// This is an asynchronous method for handling the creation of a new review.
	static async apiPostReview(req, res, next) {
		try {
			// Extract data from the request's body.
			const movieId = req.body.movie_id;
			const review = req.body.review;
			const userInfo = {
				name: req.body.name,
				_id: req.body.user_id
			};
			// Create a new date object to record the review date and time.
			const date = new Date();

			// Add a new review with the DAO
			const ReviewResponse = await ReviewsDataAccessObject.addReview(
				movieId,
				userInfo,
				review,
				date
			);
			// If there was an error with posting the review, catch it
			if (ReviewResponse.error) {
				throw new Error(ReviewResponse.error);
			}
			// Send a JSON response indicating a successful review update.
			res.json({ status: "success" });
		} catch (e) {
			// If an error occurs during the review submission, handle it here.
			// Set the response status to 500 (Internal Server Error) and send an error message.
			res.status(500).json({ error: e.message });
		}
	}
	// This is an asynchronous method for handling the update of an existing review.
	static async apiUpdateReview(req, res, next) {
		try {
			// Extract data from the request's body.
			const reviewId = req.body.review_id;
			const review = req.body.review;

			// Create a new date object for the date of the updated review
			const date = new Date();

			// Update the review with the DAO
			const ReviewResponse = await ReviewsDataAccessObject.updateReview(
				reviewId,
				req.body.user_id,
				review,
				date
			);

			// If there was an error with updating the review, catch it
			if (ReviewResponse.error) {
				throw new Error(ReviewResponse.error);
			}

			// // If the modifiedCount is 0, it means the update didn't affect any records.
			console.log(ReviewResponse.modifiedCount);
			if (ReviewResponse.modifiedCount === 0) {
				throw new Error(
					"Unable to update review. User may not be the original poster or review may not exist."
				);
			}
			// Send a JSON response indicating a successful review update.
			res.json({ status: "success" });
		} catch (e) {
			// If an error occurs during the review update, handle it here.
			// Set the response status to 500 (Internal Server Error) and send an error message.
			res.status(500).json({ error: e.message });
		}
	}
	// This is an asynchronous method for handling the deletion of an existing review.
	static async apiDeleteReview(req, res, next) {
		try {
			// Extract data from the request's body.
			const reviewId = req.body.review_id;
			const userId = req.body.user_id;

			// Delete the review with the DAO
			const ReviewResponse = await ReviewsDataAccessObject.deleteReview(
				reviewId,
				userId
			);

			// // If the deletedCount is 0, it means the deletion didn't affect any records.
			if (ReviewResponse.deletedCount === 0) {
				throw new Error(
					"Unable to delete review. User may not be the original poster or review may not exist."
				);
			}

			// Send a JSON response indicating successful deletion.
			res.json({ status: "success" });
		} catch (e) {
			// If an error occurs during the review deletion, handle it here.
			// Set the response status to 500 (Internal Server Error) and send an error message.
			res.status(500).json({ error: e.message });
		}
	}
}
