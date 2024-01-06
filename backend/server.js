// Import the 'express' library for creating an Express.js application.
import express from "express";

// Import the 'cors' library for enabling Cross-Origin Resource Sharing (CORS).
import cors from "cors";

// Import the 'movies' route from the 'movies.route.js' file.
import movies from "./api/movies.route.js";

// Create a new Express.js application instance.
const app = express();

// Enable CORS to allow requests from different origins.
app.use(cors());

// Parse incoming JSON data from HTTP requests.
app.use(express.json());

// Define a route for handling movie-related API requests.
app.use("/api/v1/movies", movies);

// Define a catch-all route for handling any other requests with a 404 Not Found response.
app.use("*", (req, res) => {
	res.status(404).json({ error: "Not found" });
});

// Export the 'app' object, making it available for use in other parts of the application.
export default app;
