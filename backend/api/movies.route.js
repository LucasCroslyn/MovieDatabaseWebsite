// Import the 'express' library to create a router.
import express from "express";

// API for movies
import MoviesController from "./movies.controller.js";

// API for reviews
import ReviewsController from "./reviews.controller.js";

// Create a new Express.js router instance.
const router = express.Router();

// Define route for the root URL path ('/').
router
	.route("/")
	// Call the API to retreive movies with the root URL
	.get(MoviesController.apiGetMovies);

//Define route to get specific movie and its ratings
router.route("/id/:id").get(MoviesController.apiGetMovieById);
// Define route for getting all ratings
router.route("/ratings").get(MoviesController.apiGetRatings);

// Define route for the /review path
router
	.route("/review")
	// Call the API for post, put, and delete requests
	.post(ReviewsController.apiPostReview)
	.put(ReviewsController.apiUpdateReview)
	.delete(ReviewsController.apiDeleteReview);

// Export the router instance, making it available for use in other parts of the application.
export default router;
