"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=36f366620ade5c54e351a12a48a38a81`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = async (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
            <h3>Vote Count:</h3>
            <p id="movie-votecount">${movie.vote_average}</p>
            <h3>Genre:</h3>
            <p>${movie.genres.map((genre) => genre.name)}</p>
            <h3>Company:</h3>
            <p>${movie.production_companies.map((company) => company.name)}</p>
            <h3>Language:</h3>
            <p>${movie.original_language}</p>
            <h3>Related Movies:</h3>
            <ul id="related-movies" class="list-unstyled"></ul>
            <h3>Trailer:</h3>
            <div id="trailer"></div>
            <h3>Director:</h3>
            <div id="movie-director"></div>
            
        </div>
    </div>`;

  const actorsList = document.getElementById("actors");
  const castUrl = constructUrl(`movie/${movie.id}/credits`);
  const relatedMoviesList = document.getElementById("related-movies");
  const relatedMoviesUrl = constructUrl(`movie/${movie.id}/similar`);
  const companyLogos = await fetchCompanyLogos(movie.production_companies);
  renderCompanyLogos(companyLogos);
  //

  const fetchYouTubeTrailer = async (movieTitle) => {
    const searchQuery = encodeURIComponent(`${movieTitle} trailer`);
    const apiKey = "AIzaSyC_3yJPW4JYGYWgrS-amQkVg533vqEBFjc";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${apiKey}&maxResults=1&type=video`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const videoId = data.items[0].id.videoId;
      return videoId;
    } catch (error) {
      console.error("Error retrieving YouTube trailer:", error);
      return null;
    }
  };

  const trailerVideoId = await fetchYouTubeTrailer(movie.title);
  if (trailerVideoId) {
    const trailerUrl = `https://www.youtube.com/watch?v=${trailerVideoId}`;
    const trailerLink = document.createElement("a");
    trailerLink.href = trailerUrl;
    trailerLink.target = "_blank";
    trailerLink.textContent = "Watch Trailer";

    const trailerContainer = document.getElementById("trailer");
    trailerContainer.appendChild(trailerLink);
    CONTAINER.appendChild(trailerContainer);
  }

  fetch(relatedMoviesUrl)
    .then((response) => response.json())
    .then((relatedMoviesData) => {
      const relatedMovies = relatedMoviesData.results.slice(0, 5);

      relatedMovies.forEach((relatedMovie) => {
        const relatedMovieItem = document.createElement("li");
        const relatedMovieImage = document.createElement("img");
        relatedMovieItem.textContent = relatedMovie.title;
        relatedMovieImage.src = BACKDROP_BASE_URL + relatedMovie.poster_path;
        relatedMovieImage.alt = relatedMovie.title;
        relatedMovieItem.appendChild(relatedMovieImage);
        relatedMoviesList.appendChild(relatedMovieItem);
        relatedMovieItem.addEventListener("click", function () {
          fetchMovie(relatedMovie.id)
            .then((relatedMovieDetails) => {
              renderMovie(relatedMovieDetails);
            })
            .catch((error) => {
              console.error("Error retrieving related movie details:", error);
            });
        });
      });
    });

  fetch(castUrl)
    .then((response) => response.json())
    .then((castData) => {
      const actors = castData.cast.slice(0, 5);

      actors.forEach((actor) => {
        const actorListItem = document.createElement("li");
        const actorImage = document.createElement("img");
        actorListItem.textContent = actor.name;
        actorImage.src = PROFILE_BASE_URL + actor.profile_path;
        actorImage.alt = actor.name;
        actorListItem.appendChild(actorImage);
        actorsList.appendChild(actorListItem);
        actorImage.addEventListener("click", function () {
          window.location.href = "actor.html";
        });
      });
    })
    .catch((error) => {
      console.error("Error retrieving movie cast:", error);
    });

  const directorName = await fetchDirectorName(movie.id);
  renderDirectorName(directorName);
};
const fetchCompanyLogos = async (companies) => {
  const companyLogos = [];

  for (const company of companies) {
    const url = constructUrl(`company/${company.id}`);
    try {
      const response = await fetch(url);
      const data = await response.json();
      const logoPath = data.logo_path;
      if (logoPath) {
        companyLogos.push({
          name: company.name,
          logoPath: logoPath,
        });
      }
    } catch (error) {
      console.error(
        `Error retrieving company details for ${company.name}:`,
        error
      );
    }
  }

  return companyLogos;
};

const renderCompanyLogos = (companyLogos) => {
  const companyLogosContainer = document.createElement("div");
  companyLogosContainer.classList.add("company-logos");

  for (const company of companyLogos) {
    const logoUrl = `http://image.tmdb.org/t/p/w185/${company.logoPath}`;
    const logoImg = document.createElement("img");
    logoImg.src = logoUrl;
    logoImg.alt = company.name;

    const logoContainer = document.createElement("div");
    logoContainer.appendChild(logoImg);
    companyLogosContainer.appendChild(logoContainer);
  }

  CONTAINER.appendChild(companyLogosContainer);
};

const fetchDirectorName = async (movieId) => {
  const creditsUrl = constructUrl(`movie/${movieId}/credits`);
  try {
    const response = await fetch(creditsUrl);
    const data = await response.json();
    const crew = data.crew;
    const director = crew.find((member) => member.job === "Director");
    return director ? director.name : "N/A";
  } catch (error) {
    console.error("Error retrieving movie credits:", error);
    return "N/A";
  }
};

const renderDirectorName = (directorName) => {
  const directorElement = document.getElementById("movie-director");
  directorElement.textContent = directorName;
};

document.addEventListener("DOMContentLoaded", autorun);
