// Import the 'app' object from the 'server.js' file.
import app from "./server.js";

// Import the MongoDB library.
import mongodb from "mongodb";

// Import the 'dotenv' library for loading environmental variables.
import dotenv from "dotenv";

// Import the MoviesDataAccessObject to filter/return certain movies from the database
import MoviesDataAccessObject from "./dao/moviesDAO.js";

// Import the ReviewsDataAccessObject to deal with reviews in the database
import ReviewsDataAccessObject from "./dao/reviewsDAO.js";

// Asynchronous function that serves as the entry point of the application.
async function main() {
	// Load environmental variables from a .env file (if present).
	dotenv.config();

	// Create a new MongoDB client instance using the connection URI provided in the 'MOVIEREVIEWS_DB_URI' environmental variable.
	const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);

	// Set the server port using the environmental variable 'PORT' or default to 8000.
	const port = process.env.PORT || 8000;

	try {
		// Connect to the MongoDB cluster that has the database.
		await client.connect();

		// Initiates a reference to the movies collection in the database
		await MoviesDataAccessObject.injectDatabase(client);

		// Initiates a reference to the reviews collection in the database
		await ReviewsDataAccessObject.injectDB(client);

		// Start the Express.js server and listen on the specified port.
		app.listen(port, () => {
			console.log("Server is running on port: " + port);
		});
	} catch (e) {
		// Log any errors that occur during the connection or server startup.
		console.error(e);

		// Exit the process with a non-zero status code to indicate an error.
		process.exit(1);
	}
}

// Call the 'main' function and catch any errors, logging them to the console.
main().catch(console.error);
