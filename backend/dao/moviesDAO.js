import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

// Will store reference to movies collection in database
let movies;

export default class MoviesDataAccessObject {
	// This is a static method that will be called to initialize the shared variable 'movies' asynchronously.
	// Static is what makes the 'movies' variable shared.
	// Async makes it so the whole application does not have to wait for it.
	static async injectDatabase(conn) {
		// If movies collection is already initialized, do nothing
		if (movies) {
			return;
		}
		try {
			// Assuming the cluster connects properly, selects the correct database and collection within it
			movies = await conn
				.db(process.env.MOVIEREVIEWS_NS)
				.collection("movies");
		} catch (e) {
			// If an error occurs during database/collection connection, log an error message.
			console.error(`Unable to connect in MoviesDataAccessObject: ${e}`);
		}
	}
	// Function to get the list of movies (and count) based on filters
	static async getMovies({
		// Default filter (no filter for movies)
		filters = null,
		// Start on page 0
		page = 0,
		// Will only get 20 movies per page
		moviesPerPage = 20
	} = {}) {
		// Only fill query if there is a filter
		let query = {};

		if (filters) {
			console.log(filters);
			if (filters.hasOwnProperty("title")) {
				// Construct a text search query if the 'title' filter is provided
				query.$text = { $search: filters["title"] };
			}
			if (filters.hasOwnProperty("rated")) {
				// Construct an equality query for the 'rated' filter
				query.rated = { $eq: filters["rated"] };
			}
		}

		let cursor;

		try {
			// Perform a database query using the constructed 'query'
			cursor = await movies
				.find(query)
				.skip(moviesPerPage * page)
				.limit(moviesPerPage);

			// Convert the cursor results to an array of movies
			const moviesList = await cursor.toArray();

			// Get the total number of movies that match the query
			const totalNumMovies = await movies.countDocuments(query);

			// Return the list of movies and the total number of matching movies
			return { moviesList, totalNumMovies };
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);

			// Return an empty list of movies and a total count of 0 in case of an error
			return { moviesList: [], totalNumMovies: 0 };
		}
	}
	static async getRatings() {
		let ratings = [];
		try {
			// Use the `distinct` method to retrieve a list of distinct values in the "rated" field
			ratings = await movies.distinct("rated");

			return ratings;
		} catch (e) {
			// Handle any errors that may occur during the process
			console.error(`unable to get ratings, ${e}`);

			// Return an empty array in case of an error
			return ratings;
		}
	}

	static async getMovieById(id) {
		try {
			// Use the `aggregate` method to perform a series of operations on the collection
			return await movies
				.aggregate([
					{
						$match: {
							// Filter documents that match the provided movie ID
							_id: new ObjectId(id)
						}
					},
					{
						$lookup: {
							// Perform a left outer join with the "reviews" collection
							from: "reviews",
							localField: "_id", // Field from the "movies" collection
							foreignField: "movie_id", // Field from the "reviews" collection
							as: "reviews" // Store the results in an array field called "reviews"
						}
					}
				])
				.next(); // Return the first document from the aggregation pipeline
		} catch (e) {
			// Handle any errors that may occur during the process
			console.error(`something went wrong in getMovieById: ${e}`);
			throw e; // Re-throw the error for further handling
		}
	}
}
