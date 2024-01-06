import MoviesDataAccessObject from "../dao/moviesDAO.js";

export default class MoviesController {
	// Function for handling default URL
	static async apiGetMovies(req, res, next) {
		// Determine the number of movies per page, default to 20 if not specified
		// If req.query.moviesPerPage exists, do parseInt, otherwise, 20
		const moviesPerPage = req.query.moviesPerPage
			? parseInt(req.query.moviesPerPage)
			: 20;

		// Determine the page number, default to 0 if not specified
		const page = req.query.page ? parseInt(req.query.page) : 0;

		// Initialize an empty filters object
		let filters = {};

		// Check if 'rated' is in the query parameters
		if (req.query.rated) {
			filters.rated = req.query.rated;
		}
		// Check if 'title' is in the query parameters
		if (req.query.title) {
			filters.title = req.query.title;
		}

		// Call the 'getMovies' method from MoviesDAO to retrieve movie data
		const { moviesList, totalNumMovies } =
			await MoviesDataAccessObject.getMovies({
				filters,
				page,
				moviesPerPage
			});

		// Prepare the response object
		let response = {
			movies: moviesList,
			page: page,
			filters: filters,
			entries_per_page: moviesPerPage,
			total_results: totalNumMovies
		};

		// Send the response as JSON to the caller of the URL
		res.json(response);
	}
	// Function for getting an individual movie by its ID
	static async apiGetMovieById(req, res, next) {
		try {
			// Extract the movie ID from the request parameters or provide an empty object by default
			let id = req.params.id || {};
			// Call the DAO function to retrieve the movie by its ID
			let movie = await MoviesDataAccessObject.getMovieById(id);

			// If the movie is not found, return a 404 Not Found response
			if (!movie) {
				res.status(404).json({ error: "not found" });
				return;
			}
			// If the movie is found, return it in the response
			res.json(movie);
		} catch (e) {
			// Handle any errors that may occur during the process
			console.log(`Error getting movie by ID, ${e}`);
			res.status(500).json({ error: e });
		}
	}
	// Function to retrieve list of ratings
	static async apiGetRatings(req, res, next) {
		try {
			// Call the DAO function to retrieve a list of ratings
			let propertyTypes = await MoviesDataAccessObject.getRatings();

			// Return the list of property types (ratings) in the response
			res.json(propertyTypes);
		} catch (e) {
			// Handle any errors that may occur during the process
			console.log(`Error getting list of ratings in API, ${e}`);
			res.status(500).json({ error: e });
		}
	}
}
