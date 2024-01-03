// Import necessary modules from React and React Router
import React from "react";
import { Route, Routes, Link } from "react-router-dom"; // Import stuff for routing
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for UI styling
import AddReview from "./components/add-review"; // Import AddReview component
import MoviesList from "./components/movies-list"; // Import MoviesList component
import Movie from "./components/movie"; // Import Movie component
import Login from "./components/login"; // Import Login component
import Nav from "react-bootstrap/Nav"; // Import Nav component from React Bootstrap
import Navbar from "react-bootstrap/Navbar"; // Import Navbar component from React Bootstrap

// Define the main component of the application, named App
function App() {
	// Use React Hook to create a state variable 'user' and a function 'setUser' to update it
	const [user, setUser] = React.useState(null);

	// Define an asynchronous function 'login' that takes a 'user' parameter and sets the user state
	async function login(user = null) {
		setUser(user);
	}

	// Define an asynchronous function 'logout' that sets the user state to null
	async function logout() {
		setUser(null);
	}

	// Return the JSX (UI) for the App component
	return (
		<div className="App">
			{/* Navbar component for navigation */}
			<Navbar
				bg="light"
				expand="lg"
			>
				<Navbar.Brand>Movie Reviews</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					{/* Navigation links */}
					<Nav className="mr-auto">
						<Nav.Link>
							{/* Link to MoviesList component */}
							<Link to={"/movies"}>Movies</Link>
						</Nav.Link>
						<Nav.Link>
							{/* Conditional rendering of login/logout links based on user state 
              If user is currently logged in, the logout function will run*/}
							{user ? (
								<a onClick={logout}>Logout User</a>
							) : (
								<Link to={"/login"}>Login</Link>
							)}
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>

			{/* React Router Routes for different paths */}
			<Routes>
				<Route
					path="/"
					element={<MoviesList />} // Render MoviesList component for the root path
				/>
				<Route
					path="/movies"
					element={<MoviesList />} // Render MoviesList component for the /movies path
				/>
				<Route
					path="/movies/:id/review"
					element={<AddReview user={user} />} // Render AddReview component with user prop for movie review path
				/>
				<Route
					path="/movies/:id/"
					element={<Movie user={user} />} // Render Movie component with user prop for movie details path
				/>
				<Route
					path="/login"
					element={<Login login={login} />} // Render Login component with login function prop for login path
				/>
			</Routes>
		</div>
	);
}

// Export the App component as the default export
export default App;
