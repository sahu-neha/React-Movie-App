/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import { updateSearchCount, getTrendingMovies } from "../appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};

const App = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [movies, setMovies] = useState([]);
	const [trendingMovies, setTrendingMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

	const fetchMovies = async (query = "") => {
		setIsLoading(true);
		setErrorMessage("");
		try {
			const endpoint = query
				? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

			const response = await fetch(endpoint, API_OPTIONS);
			const data = await response.json();

			if (data.response === "False") {
				setErrorMessage(
					data.error || "An error occurred while fetching movies."
				);
				setMovies([]);
				return;
			}

			if (data.results.length === 0) {
				setErrorMessage("No movies found for the given search term.");
			}

			setMovies(data.results || []);

			if (query && data.results.length > 0)
				await updateSearchCount(query, data.results[0]);
		} catch (error) {
			console.error("Error fetching movies:", error);
			setErrorMessage("Failed to fetch movies. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	const loadTrendingMovies = async () => {
		try {
			const trending = await getTrendingMovies();
			setTrendingMovies(trending);
		} catch (error) {
			console.error("Error loading trending movies:", error);
		}
	};

	useEffect(() => {
		loadTrendingMovies();
	}, []);

	useEffect(() => {
		fetchMovies(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	return (
		<main>
			<div className="pattern">
				<div className="wrapper">
					<header>
						<img src="./hero-img.png" alt="hero banner" />
						<h1>
							Find <span className="text-gradient"> Movies</span> You'll Enjoy
							Without the Hassle{" "}
						</h1>
						<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
					</header>

					<div style={{ marginBottom: "20px" }}></div>

					{trendingMovies.length > 0 && (
						<section className="trending">
							<h2>Trending Searches</h2>
							<ul>
								{trendingMovies.map((movie, index) => (
									<li key={movie.$id} >
										<p>{index + 1}</p>
										<img
											src={movie.poster_url ? movie.poster_url : "/No-Poster.png"}
											alt={movie.searchTerm}
										/>
									</li>
								))}
							</ul>
						</section>
					)}

					<section className="all-movies">
						<h2>All Movies</h2>
						{isLoading ? (
							<p className="text-white">Loading movies...</p>
						) : errorMessage ? (
							<p className="error text-red-500">{errorMessage}</p>
						) : (
							<ul>
								{movies.map((movie) => (
									<MovieCard key={movie.id} movie={movie} />
								))}
							</ul>
						)}
					</section>
				</div>
			</div>
		</main>
	);
};

export default App;
