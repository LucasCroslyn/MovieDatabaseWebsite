import mongodb from "mongodb";

// Unique identifier for MongoDB databases
const ObjectId = mongodb.ObjectId;

// Will store reference to reviews collection in database
let reviews;

export default class ReviewsDataAccessObject {
	// This is a static method that will be called to initialize the shared variable 'reviews' asynchronously.
	// Static is what makes the 'reviews' variable shared.
	// Async makes it so the whole application does not have to wait for it.
	static async injectDB(conn) {
		// If reviews collection is already initialized, do nothing
		if (reviews) {
			return;
		}
		try {
			// Assuming the cluster connects properly, selects the correct database and collection within it
			reviews = await conn
				.db(process.env.MOVIEREVIEWS_NS)
				.collection("reviews");
		} catch (e) {
			// If an error occurs during database/collection connection, log an error message.
			console.error(`Unable to connect in reviewDataAccessObject: ${e}`);
		}
	}
	// Function to add a new review to the collection
	static async addReview(movieId, user, review, date) {
		try {
			// Need to make sure the ID format is proper for MongoDB
			movieId = new ObjectId(movieId);
			// Checks if a review for this movie by this user exists
			const existingReview = await reviews.findOne({
				user_id: user._id,
				movie_id: movieId
			});

			// Throws error if user made review on this movie
			if (existingReview) {
				throw new Error(
					"A review for this movie by the user exists already"
				);
			}

			const reviewDoc = {
				name: user.name,
				user_id: user._id,
				date: date,
				review: review,
				movie_id: movieId
			};
			// Inserts the review into the collection
			return await reviews.insertOne(reviewDoc);
		} catch (e) {
			// Console log to see error in the terminal
			console.error(`unable to post review: ${e}`);
			// Return error for the review controller
			throw e;
		}
	}
	// Function to update an existing review in the collection
	static async updateReview(reviewId, userId, review, date) {
		try {
			const updateResponse = await reviews.updateOne(
				// Filters for reviews with user_id as userId and _id as reviewID
				{ user_id: userId, _id: new ObjectId(reviewId) },
				// Sets the current review and date fields to the new review and date fields
				{ $set: { review: review, date: date } },
				// Doesn't add review if not in collection
				{ upsert: false }
			);
			return updateResponse;
		} catch (e) {
			// Console log to see error in the terminal
			console.error(`unable to update review: ${e}`);
			// Return error for the review controller
			throw e;
		}
	}
	// Function to delete an existing review in the collection
	static async deleteReview(reviewId, userId) {
		try {
			const deleteResponse = await reviews.deleteOne({
				// Filters for reviews with user_id as userId and _id as reviewID
				// If review exists, deletes it and returns response about process
				_id: new ObjectId(reviewId),
				user_id: userId
			});
			return deleteResponse;
		} catch (e) {
			// Console log to see error in the terminal
			console.error(`unable to delete review: ${e}`);
			// Return error for the review controller
			throw e;
		}
	}
}
