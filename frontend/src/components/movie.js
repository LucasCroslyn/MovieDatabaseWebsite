import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movies";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// import Button from "react-bootstrap/Button";

const Movie = ({ user }) => {
	// useParams allows us to get the ID directly from the URL
	const { id } = useParams();

	// Set some variables for what we want to show
	const [movie, setMovie] = useState({
		id: null,
		title: "",
		rated: "",
		reviews: []
	});

	// Image error detection variables
	const [imageError, setImageError] = useState(false);

	const handleImageError = (error) => {
		console.error("Error loading image: ", error);
		setImageError(true);
	};

	const getMovie = (id) => {
		// Calls the movie service to update the movie information we are displaying
		MovieDataService.get(id)
			.then((response) => {
				setMovie(response.data);
				console.log(response.data);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	useEffect(() => {
		// Use the id extracted from the URL from using useParams earlier
		if (id) {
			getMovie(id);
		}
	}, [id]);

	return (
		<div>
			<Container>
				<Row>
					<Col>
						{/*Sometimes the movie does not have a poster in the database.
						Other times the image no longer exists.
						Handle error detection in either case.*/}
						{!imageError ? (
							<Image
								src={movie.poster}
								fluid
								onError={(e) => handleImageError(e)}
							/>
						) : (
							// If poster image error, display text instead
							<p>NO POSTER IMAGE AVAILABLE</p>
						)}
					</Col>
					<Col>
						<Card>
							<Card.Header as="h5">{movie.title}</Card.Header>
							<Card.Body>
								<Card.Text>{movie.plot}</Card.Text>
								{/*User needs to be logged in to see this text/link*/}
								{user && (
									<Link to={`/movies/${id}/review`}>
										Add Review
									</Link>
								)}
							</Card.Body>
						</Card>
						{/*I believe this is a line break or something similar*/}
						<br></br>
						<h2>Reviews</h2>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Movie;
