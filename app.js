// Movie database grabber
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('movie-search');
const movieList = document.getElementById('movie-list');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error');

const API_KEY = '3d0aeca3';
const OMDB_URL = 'http://www.omdbapi.com/';

// Event listener for movie search button
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    } else {
        showError('Please enter a movie title.');
    }
});

/**
    * Fetch movies from the OMDB API
    * @param {string} query - The movie title to search for
*/
async function fetchMovies(query) {
    showLoading(true);
    try {
        const response = await fetch(`${OMDB_URL}?s=${query}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            showError(data.Error);
        }
    } catch (error) {
        showError('An error occurred while fetching movie data.');
    }
    showLoading(false);
}

/**
    * Display a list of movies in the UI
    * @param {Array} movies - List of movie objects returned from API
*/
function displayMovies(movies) {
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const moviePoster = movie.Poster !== 'N/A' ? movie.Poster : '';
        movieCard.innerHTML = `
            <img src="${moviePoster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
            <button onclick="fetchMovieDetails('${movie.imdbID}')">View Details</button>
        `;
        movieList.appendChild(movieCard);
    });
}

/**
    * Fetch detailed movie information from OMDB API
    * @param {string} imdbID - The movie ID of the selected movie
*/
async function fetchMovieDetails(imdbID) {
    showLoading(true);
    try {
        const response = await fetch(`${OMDB_URL}?i=${imdbID}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === 'True') {
            showMovieDetails(data);
        } else {
            showError(data.Error);
        }
    } catch (error) {
        showError('An error occurred while fetching movie details.');
    }
    showLoading(false);
}

/**
    * Display detailed movie information
    * @param {Object} movie - Movie details object returned from API
*/
function showMovieDetails(movie) {
    const movieDetails = `
        <div class="movie-card" style="width: 500px;">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : ''}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Rated:</strong> ${movie.Rated}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
        </div>
    `;
    movieList.innerHTML = movieDetails;
}

// Loading indicator
function showLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}