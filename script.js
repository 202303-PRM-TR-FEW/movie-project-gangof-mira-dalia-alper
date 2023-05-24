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
  return `${TMDB_BASE_URL}/${path}/?api_key=36f366620ade5c54e351a12a48a38a81
 `;
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
  const firstMovie = movies[0];
  console.log(firstMovie);
  movies.shift(); //first movie is removed as it's used for hero part
  movies.splice(2, 1); // horror movie removed as it's scary
  console.log(movies);
  const homePage = document.createElement("div");
  homePage.innerHTML = `
  <div id="hero" class="w-full h-[550px] text-white">
    <div class="w-full h-full">
      <div class='absolute w-96 h-[550px] bg-gradient-to-r from-black'></div>
      <img class="w-full rounded-lg h-full object-cover" src="${BACKDROP_BASE_URL}/${
    firstMovie.backdrop_path
  }" />
      <div class="absolute top-[20%] pl-6 p-4 md:p-8">
        <h1 class="text-3xl font-bold text-white">${
          firstMovie.original_title
        }</h1>
        <p class="py-8 max-w-xl">${firstMovie.overview}</p>
      </div>
    </div>
  </div>

  <div class="drop-shadow-2xl  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    ${movies
      .map(
        (item) =>
          '<div class="group w-72 py-2 hover:scale-110">' +
          '<img class="rounded-lg" src="' +
          BACKDROP_BASE_URL +
          "/" +
          item.poster_path +
          '"/>' +
          '<div class="hidden bg-white/30 backdrop-blur-lg absolute rounded-lg top-full left-0 bg-white p-4 shadow-md group-hover:block"><p>' +
          item.overview +
          "</p></div>" +
          "</div>"
      )
      .join("")}
  </div>
`;

  homePage.addEventListener("click", () => {
    movieDetails(movie);
  });

  CONTAINER.appendChild(homePage);

  /* -- initial code --
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
  */
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
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
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

document.addEventListener("DOMContentLoaded", autorun);
