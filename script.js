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
  console.log(url);
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
        <img id="movie-backdrop" src=${BACKDROP_BASE_URL + movie.backdrop_path}>
        <h2 id="movie-title" class="text-4xl m-3 text-center">${movie.title}</h2>
        <p id="movie-release-date"><b>Release Date:</b> ${movie.release_date}</p>
        <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
      </div>
      <div class="col-md-8">
        <h3 class="mt-2"><b>Overview:</b></h3>
        <p id="movie-overview">${movie.overview}</p>
        <h3 class="mt-2"><b>Ratings:</b> <i>${movie.vote_average}</i></h3>
        <h3 class="mt-2"><b>Genre:</b> <i>${movie.genres.map((genre) => genre.name)}</i></h3>
        <h3 class="mt-2"><b>Language:</b> <i>${movie.original_language}</i></h3>
        <h3 class="mt-2"><b>Director:</b> <i id="movie-director"></i></h3>
      </div>
      <div class="grid place-items-center">
        <div id="trailer"></div>
        <h2 class="mt-10 text-white text-xl"><b>Main Actors of the Movie</b></h2>
        <div id="actors" class="hover:ease-in duration-300 list-unstyled grid grid-cols-3 gap-20"></div>
        <h2 class="mt-20 mb-2 text-white text-xl"><b>Related Movies:</b></h2>
        <div id="related-movies" class="list-unstyled grid grid-cols-3 col-md-8 gap-20 hover:ease-in duration-300 "></div>
      </div>
    </div>`;

  const companyLogos = await fetchCompanyLogos(movie.production_companies);
  renderCompanyLogos(companyLogos);

  const castUrl = constructUrl(`movie/${movie.id}/credits`);
  const relatedMoviesList = document.getElementById("related-movies");
  const relatedMoviesUrl = constructUrl(`movie/${movie.id}/similar`);

  const fetchYouTubeTrailer = async (movieTitle) => {
    const searchQuery = encodeURIComponent(`${movieTitle} trailer`);
    const apiKey = 'AIzaSyC_3yJPW4JYGYWgrS-amQkVg533vqEBFjc';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&key=${apiKey}&maxResults=1&type=video`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const videoId = data.items[0].id.videoId;
      return videoId;
    } catch (error) {
      console.error('Error retrieving YouTube trailer:', error);
      return null;
    }
  };

  const trailerVideoId = await fetchYouTubeTrailer(movie.title);
  if (trailerVideoId) {
    const trailerUrl = `https://www.youtube.com/watch?v=${trailerVideoId}`;
    const trailerLink = document.createElement('a');
    trailerLink.href = trailerUrl;
    trailerLink.target = '_blank';
    trailerLink.textContent = 'Watch Trailer';

    const trailerContainer = document.getElementById("trailer");
    trailerContainer.appendChild(trailerLink);
    CONTAINER.appendChild(trailerContainer);
  }
  
  
  try {
    const relatedMoviesResponse = await fetch(relatedMoviesUrl);
    const relatedMoviesData = await relatedMoviesResponse.json();
    const relatedMovies = relatedMoviesData.results.slice(0, 6);

    relatedMovies.forEach((relatedMovie) => {
      const relatedMovieItem = document.createElement("li");
      const relatedMovieImage = document.createElement("img");
      relatedMovieImage.src = BACKDROP_BASE_URL + relatedMovie.poster_path;
      relatedMovieItem.appendChild(relatedMovieImage);
      relatedMoviesList.appendChild(relatedMovieItem);
      relatedMovieItem.addEventListener("click", async () => {
        const relatedMovieDetails = await fetchMovie(relatedMovie.id);
        renderMovie(relatedMovieDetails);
      });
    });
    
  } catch (error) {
    console.error("Error retrieving related movies:", error);
  }

  try {
    const castResponse = await fetch(castUrl);
    const castData = await castResponse.json();
    const actors = castData.cast.slice(0, 6);

    actors.forEach((actor) => {
      const actorsList = document.getElementById("actors");
      const actorImage = document.createElement("img");
      const actorNameTitle = document.createElement("h1");
      actorImage.setAttribute("data-actor-id", actor.id);
      actorImage.src = PROFILE_BASE_URL + actor.profile_path;
      actorNameTitle.textContent = actor.name;
      actorNameTitle.appendChild(actorImage);
      actorsList.appendChild(actorNameTitle);

      actorImage.addEventListener("click", async () => {
        const actorId = actorImage.getAttribute("data-actor-id");
        await fetchAndRenderActorData(actorId);
      });
    });
  } catch (error) {
    console.error("Error retrieving movie cast:", error);
  }

  const directorName = await fetchDirectorName(movie.id);
  renderDirectorName(directorName);
 
  
};

const actorId = new URLSearchParams(window.location.search).get("id");
const fetchAndRenderActorData = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  try {
    const response = await fetch(`${TMDB_BASE_URL}/person/${actorId}?api_key=36f366620ade5c54e351a12a48a38a81`);
    if (!response.ok) {
      throw new Error("Error retrieving actor data");
    }
    const actorData = await response.json();
   
    if (actorData) {
      const actorDetails = {
        id: actorData.id,
        name: actorData.name,
        biography: actorData.biography,
        profilePath: actorData.profile_path,
        birthday: actorData.birthday,
        gender: actorData.gender,
        popularity: actorData.popularity
      };

      // Create a new HTML page
      const newPage = document.createElement("html");
      newPage.innerHTML = `
        <head>
          <title>${actorDetails.name} Details</title>
          <link rel="stylesheet" href="style.css">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
        <div class = "">
          <h1 class= "text-center mt-10 text-2xl">${actorDetails.name}</h1>
          <div class = "grid grid-flow-col auto-cols-auto m-10">
            <div class = "col-md-4">
              <img src="${PROFILE_BASE_URL}${actorDetails.profilePath}" alt="${actorDetails.name} Profile Picture">
            </div>
            <div class="col-md-8 mx-6">
              <h3><b>Biography:</b></h3>
              <p>${actorDetails.biography}</p>
              <h3><b>Birthday:</b>  <i>${actorDetails.birthday}</i></h3>
              <h3><b>Gender:</b>  <i>${actorDetails.gender === 1 ? "female" : "male"}</i></h3>
              <h3><b>Popularity:</b>  <i>${actorDetails.popularity}</i></h3>
            </div>
          </div>
          <div class="grid place-items-center">
            <h3 class="m-5"><b>Actor's movies:</b></h3>
            <div id="filmography" class="list-unstyled grid grid-cols-3 col-md-8 gap-20"></div>
          </div>
        </div>
      </body>
      `;

      // Open the new page in the current window
      document.open();
      document.write(newPage.outerHTML);
      document.close();
      console.log("anuthn")
      renderFilmographyData(actorId);
    }

  } catch (error) {
    console.error("Error fetching actor data:", error);
  }
};

const fetchMovieCredits = async (actorId) => {
  const url = constructUrl(`person/${actorId}/movie_credits`);
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const renderFilmographyData = async (actorId) => {
  const filmographyList = document.getElementById("filmography");
  try {
    const movieCredits = await fetchMovieCredits(actorId);
    const movies = movieCredits.cast.slice(0, 6);
    movies.forEach((movie) => {
      const filmographyItem = document.createElement("li");
      const filmographyImage = document.createElement("img");
      if (movie.poster_path) {
        filmographyImage.src = BACKDROP_BASE_URL + movie.poster_path;
        filmographyItem.appendChild(filmographyImage);
      } else {
        filmographyItem.textContent = movie.title;
      }
      filmographyList.appendChild(filmographyItem);
      filmographyItem.addEventListener("click",
        async () => {
        const movieDetails = await fetchMovie(movie.id);
        renderMovie(movieDetails);
    });
      
    });
  } catch (error) {
    console.error("Error retrieving filmography data:", error);
  }
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
      console.error(`Error retrieving company details for ${company.name}:`, error);
    }
  }

  return companyLogos;
};

const renderCompanyLogos = (companyLogos) => {
  const companyLogosContainer = document.createElement('div');
  companyLogosContainer.classList.add('company-logos');

  for (const company of companyLogos) {
    const logoUrl = `http://image.tmdb.org/t/p/w185/${company.logoPath}`;
    const logoImg = document.createElement('img');
    logoImg.src = logoUrl;
    logoImg.alt = company.name;

    const logoContainer = document.createElement('div');
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
    const director = crew.find((member) => member.job === 'Director');
    return director ? director.name : 'N/A';
  } catch (error) {
    console.error('Error retrieving movie credits:', error);
    return 'N/A';
  }
};

const renderDirectorName = (directorName) => {
  const directorElement = document.getElementById('movie-director');
  directorElement.textContent = directorName;
};


document.addEventListener("DOMContentLoaded", autorun);
