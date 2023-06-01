"use strict";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

const homebtn = document.querySelector("#homebtn");
let ArrayOfMovies = [];

//Movies by Genre
function movieByGenre(genreId) {
  let searchResult = [];
  CONTAINER.innerHTML = "";
  CONTAINER.setAttribute("class", "container");
  const searchUrl = `${TMDB_BASE_URL}/discover/movie?api_key=36f366620ade5c54e351a12a48a38a81&with_genres=${genreId}`;
  const fetchData = async () => {
    try {
      const searchRes = await fetch(searchUrl);
      const searchObj = await searchRes.json();
      searchResult = searchObj.results;
      renderMovies(searchResult);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData().catch((error) => {
    console.error(error);
  });
}

//Sort by date
function sortByDate() {
  ArrayOfMovies.sort((a, b) => {
    const yearA = parseInt(a.release_date.slice(0, 4));
    const yearB = parseInt(b.release_date.slice(0, 4));
    return yearA - yearB;
  });
  CONTAINER.innerHTML = "";
  CONTAINER.setAttribute("class", "container");
  renderMovies(ArrayOfMovies);
}

//Movie Lists like Popular, upcoming, now playing etc.
function movieList(subject) {
  let searchResult = [];
  CONTAINER.innerHTML = "";
  CONTAINER.setAttribute("class", "container");
  const fetchData = async () => {
    try {
      const searchUrl = `${TMDB_BASE_URL}/movie/${subject}?api_key=36f366620ade5c54e351a12a48a38a81`;
      const searchRes = await fetch(searchUrl);
      const searchObj = await searchRes.json();
      searchResult = searchObj.results;
      renderMovies(searchResult);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData().catch((error) => {
    console.error(error);
  });
}

//About Page Frontend Warriors
function renderAboutPage() {
  CONTAINER.innerHTML = "";
  CONTAINER.setAttribute("class", "container");
  CONTAINER.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img src="./assets/poster1.png" />
        <h2 id="movie-title" class="text-4xl m-3 text-center text-[#22A39F]">Frontend Warriors</h2>
        <p id="movie-release-date" class="text-[#22A39F]"><b>Release Date:</b><i>01.06.2023</i></p>
        <p id="movie-runtime" class="text-[#22A39F]"><b>Runtime:</b><i>92 Minutes</i></p>
      </div>
      <div class="col-md-8">
        <h3 class="mt-2 text-[#22A39F]"><b>Overview:</b></h3>
        <i id="movie-overview">Three fearless bootcamp students start a journey to defeat all the bugs in front of them to create the most awesome movie-website.</i>
        <h3 class="mt-2 text-[#22A39F]"><b>Ratings:</b> <i>10.0</i></h3>
        <h3 class="mt-2 text-[#22A39F]"><b>Genre:</b> <i>Action, Adventure, Sleepless nights</i></h3>
        <h3 class="mt-2 text-[#22A39F]"><b>Language:</b> <i>English</i></h3>
        <div class="border border-solid w-32 p-2 text-center hover:scale-105 rounded-lg bg-white"><a  href="https://www.youtube.com/watch?v=1Rf9-Ej2xPw&t=2s">Watch Trailer</a></div>
      </div>
        <div class="mt-10 text-white text-4xl"><h1>Actors</h></div>
        <div id=actors" class=" drop-shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">
          <div class="w-72 py-2 relative z-0 hover:scale-105 ">
          <img class="rounded-lg" src="./assets/dalia-lg-pic.jpeg"/>
          <div class=" h-12 w-60 z-10 text-center backdrop-blur-lg bg-white/60 rounded-lg bg-white p-4"><p>Dalia Khalifa</p></div>
          </div>
          <div class="w-72 py-2 relative z-0 hover:scale-105 ">
          <img class="rounded-lg" src="./assets/alper-lg-pic.jpeg"/>
          <div class=" h-12 w-60 z-10 text-center backdrop-blur-lg bg-white/60 rounded-lg bg-white p-4"><p>Alper Yazagan</p></div>
          </div>
          <div class="w-72 py-2 relative z-0 hover:scale-105 ">
          <img class="rounded-lg" src="./assets/mira-lg-pic.jpeg"/>
          <div class=" h-12 w-60 z-10 text-center backdrop-blur-lg bg-white/60 rounded-lg bg-white p-4"><p>Mira Amer</p></div>
          </div>
        </div>;`;
}

//Navbar Buttons
function actorPage() {
  let searchResult = [];

  const searchUrl = `${TMDB_BASE_URL}/trending/person/day?api_key=36f366620ade5c54e351a12a48a38a81`;
  const fetchData = async () => {
    try {
      const searchRes = await fetch(searchUrl);
      const searchObj = await searchRes.json();
      searchResult = searchObj.results;
      renderResults(searchResult); // Call renderResults inside fetchData
    } catch (error) {
      console.error(error);
    }
  };

  fetchData().catch((error) => {
    console.error(error);
  });

  const renderResults = (searchResult) => {
    CONTAINER.innerHTML = "";
    CONTAINER.setAttribute(
      "class",
      "drop-shadow-2xl w-full grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    );

    searchResult.forEach((person) => {
      if (person.profile_path) {
        const personElement = document.createElement("div");
        personElement.classList.add("w-72", "py-2", "hover:scale-105");
        personElement.innerHTML = `
    <img class="rounded-lg hover:cursor-pointer" src="${BACKDROP_BASE_URL}${person.profile_path}"/>
    <div class="relative bottom-20 left-6 bg-[#F3EFE0]/30 backdrop-blur-lg w-60 rounded-lg bg-white p-4 shadow-md">
      <p class="text-center">${person.original_name}</p>
    </div>
  `;
        CONTAINER.appendChild(personElement);

        personElement.setAttribute("data-actor-id", person.id);
        personElement.addEventListener("click", async () => {
          const actorId = personElement.getAttribute("data-actor-id");
          await fetchAndRenderActorData(actorId);
        });
      }
    });
  };
}

// Search Function
function search() {
  let searchResult = [];

  CONTAINER.innerHTML = "";
  CONTAINER.setAttribute("class", "container");

  const input = document.getElementById("search-box").value;
  const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=36f366620ade5c54e351a12a48a38a81&query=${input}`;
  const fetchData = async () => {
    try {
      const searchRes = await fetch(searchUrl);
      const searchObj = await searchRes.json();
      searchResult = searchObj.results;
      searchResult = searchResult.filter((item) => item.poster_path);
      console.log(searchResult);
      renderMovies(searchResult); // Call renderResults inside fetchData
    } catch (error) {
      console.error(error);
    }
  };
  fetchData().catch((error) => {
    console.error(error);
  });
}

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
  ArrayOfMovies = movies.results;
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
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
  const firstMovie = movies[0];
  const homePage = document.createElement("div");
  homePage.innerHTML = `
      <div id="hero" class="w-full h-[550px] text-white">
        <div class="w-full h-full">
          <div class='absolute w-96 h-[550px] rounded-lg bg-gradient-to-r from-black'></div>
          <img class="w-full rounded-lg h-full object-cover" src="${BACKDROP_BASE_URL}/${firstMovie.backdrop_path}" />
          <div class="absolute top-[20%] pl-6 p-4 md:p-8">
            <h1 class="text-3xl font-bold text-white">${firstMovie.original_title}</h1>
            <p class="py-8 max-w-xl">${firstMovie.overview}</p>
          </div>
        </div>
      </div>
      <div id="moviesgrid" class="drop-shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">
      </div>
    `;
  CONTAINER.appendChild(homePage);

  const moviesgrid = document.getElementById("moviesgrid");
  movies.forEach((movie) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("group", "w-72", "py-2", "hover:scale-105");
    movieElement.innerHTML = `
    <img class="rounded-lg hover:cursor-pointer" src="${BACKDROP_BASE_URL}${movie.poster_path}"/>
    <div class="hidden bg-white/30 h-full backdrop-blur-lg absolute rounded-lg top-0 left-0 bg-white p-4 shadow-md group-hover:block">
      <p>${movie.overview}</p>
    </div>
  `;
    moviesgrid.appendChild(movieElement);
  });

  moviesgrid.addEventListener("click", (event) => {
    const movieElement = event.target.closest(".group");
    if (movieElement) {
      const index = Array.from(moviesgrid.children).indexOf(movieElement);
      movieDetails(movies[index]);
    }
  });
};
// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = async (movie) => {
  CONTAINER.innerHTML = "";
  CONTAINER.setAttribute("class", "container");
  console.log(movie);
  CONTAINER.innerHTML = `
    <div class="row">
      <div id="hero" class="w-full h-[550px] text-white">
        <div class="w-full h-full">
          <div class='absolute w-full h-[550px] rounded-lg bg-[#000000]/40'></div>
          <img class="w-full rounded-lg h-full object-cover" src="${BACKDROP_BASE_URL}/${
    movie.backdrop_path
  }"/>
            <div class="absolute top-[20%] pl-6 p-4 md:p-8 flex items-center gap-8">
              <div class="">
                <img class="w-64" src="${BACKDROP_BASE_URL}${
    movie.poster_path
  }"/>
              </div>
              <div class="flex flex-col items-start">
                <h1 class="text-4xl font-bold text-[#22a39f]">${
                  movie.original_title
                }</h1>
                <div class="flex justify-start"><p>${movie.runtime} minutes</p>
                  <p class="px-8">${movie.vote_average}</p>
                  <p>${movie.genres.map((genre) => genre.name)}</p>
                </div>
                <p class="py-8 max-w-xl">${movie.overview}</p>
                <div class="flex gap-6">
                  <div id="trailer" class="bg-[#22a39f] p-2 rounded-lg"></div>
                    <h3 class="mt-2"><i>${movie.original_language}</i></h3>
                    <h3 class="mt-2 text-[#22a39f]"><b>Director:</b> <i id="movie-director"></i></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid place-items-center">
            <h2 class="mt-10 text-[#22a39f] text-xl"><b>Main Actors of the Movie</b></h2>
            <div id="actors" class="hover:ease-in duration-300 list-unstyled grid grid-cols-3 gap-20"></div>
              <h2 class="mt-20 mb-2 text-[#22a39f] text-xl"><b>Related Movies:</b></h2>
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

  const appendTrailerLink = (videoId) => {
    if (videoId) {
      const trailerUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const trailerLink = document.createElement("a");
      trailerLink.href = trailerUrl;
      trailerLink.target = "_blank";
      console.log("watch trailer");
      trailerLink.textContent = "Watch Trailer";

      const trailerContainer = document.getElementById("trailer");
      trailerContainer.appendChild(trailerLink);
    }
  };

  const trailerVideoId = await fetchYouTubeTrailer(movie.title);
  appendTrailerLink(trailerVideoId);

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
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${actorId}?api_key=36f366620ade5c54e351a12a48a38a81`
    );
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
        popularity: actorData.popularity,
      };

      CONTAINER.innerHTML = "";
      CONTAINER.setAttribute("class", "container");

      document.head.title = `${actorData.name} Profile`;
      CONTAINER.innerHTML = `
        <div class = "container">
          <h1 class= "text-center mt-10 text-2xl">${actorDetails.name}</h1>
          <div class = "grid grid-flow-col auto-cols-auto m-10">
            <div class = "col-md-4">
              <img src="${PROFILE_BASE_URL}${actorDetails.profilePath}" alt="${
        actorDetails.name
      } Profile Picture">
            </div>
            <div class="col-md-8 mx-6">
              <h3 class="text-[#22A39F]"><b>Biography:</b></h3>
              <i class="#F3EFE0">${actorDetails.biography}</i>
              <h3 class="text-[#22A39F]"><b>Birthday:</b>  <i>${
                actorDetails.birthday
              }</i></h3>
              <h3 class="text-[#22A39F]"><b>Gender:</b>  <i class="#F3EFE0">${
                actorDetails.gender === 1 ? "female" : "male"
              }</i></h3>
              <h3 class="text-[#22A39F]"><b>Popularity:</b>  <i>${
                actorDetails.popularity
              }</i></h3>
            </div>
          </div>
          <div class="grid place-items-center">
            <h3 class="m-5"><b>Actor's movies:</b></h3>
            <div id="filmography" class="list-unstyled grid grid-cols-3 col-md-8 gap-20"></div>
          </div>
        </div>
      `;
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
      filmographyItem.addEventListener("click", async () => {
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

//////////////////////////////////////////////
const autorunActors = async () => {
  const actors = await fetchActors();
  renderActors(actors.results);
};
const fetchActors = async () => {
  const res = await fetch(
    "https://api.themoviedb.org/3/person/popular/?api_key=36f366620ade5c54e351a12a48a38a81"
  );
  return res.json();
};

const renderActors = (actors) => {
  console.log(actors);

  const homePage = document.createElement("div");
  homePage.innerHTML = `
  <div id="hero" class="w-full h-[550px] rounded-lg bg-[#064663] text-white">
    <h1 class="text-center text-8xl py-40 font-extrabold text-[#ECB365]">Popular Actors</h1>
    <p class="text-center">note to myself: put here some cool stuff later!</p>
  </div>

  <div class="drop-shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3">
    ${actors
      .map(
        (item) =>
          '<div class="w-72 py-2 relative z-0 hover:scale-105">' +
          '<img class="rounded-lg" src="' +
          BACKDROP_BASE_URL +
          "/" +
          item.profile_path +
          '"/>' +
          '<div class="absolute left-6 bottom-6 h-12 w-60 z-10 text-center backdrop-blur-lg bg-white/30 rounded-lg bg-white p-4"><p>' +
          item.name +
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
};

///////////////////////////////////////
document.addEventListener("DOMContentLoaded", autorun);

//home button on header
homebtn.addEventListener("click", homescreen);
function homescreen() {
  CONTAINER.innerHTML = "";
  CONTAINER.setAttribute("class", "container");
  autorun();
}
