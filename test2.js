// "use strict";
// const actorId = new URLSearchParams(window.location.search).get("id");

// const TMDB_BASE_URL = "https://api.themoviedb.org/3";
// const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
// // const CONTAINER = document.querySelector(".actor-container");
// const constructUrl = (path) => {
//   return `${TMDB_BASE_URL}/${path}?api_key=36f366620ade5c54e351a12a48a38a81`;
// };

// // const fetchActor = async () => {
// //   try {
// //     const response = await fetch(`${TMDB_BASE_URL}/person/${actorId}?api_key=36f366620ade5c54e351a12a48a38a81`);
// //     const actorData = await response.json();
// //     renderActor(actorData);
// //   } catch (error) {
// //     console.error("Error retrieving actor data:", error);
// //   }
// //   fetchActorData(actorId)
// //   .then((actorData) => {
// //     renderActorData(actorData);
// //     renderFilmographyData(actorData);
// //   })
// //   .catch((error) => {
// //     console.error("Error retrieving actor data:", error);
// //   });

  
// // };
// const fetchActor = async () => {
//   try {
//     const response = await fetch(`${TMDB_BASE_URL}/person/${actorId}?api_key=36f366620ade5c54e351a12a48a38a81`);
//     const actorData = await response.json();
//     renderActor(actorData);
//     renderFilmographyData(actorData);
//   } catch (error) {
//     console.error("Error retrieving actor data:", error);
//   }
// };


// const renderActor = async (actor) => {
//   const actorContainer = document.getElementById("actor-container");
//   actorContainer.innerHTML = `
//     <h1>${actor.name}</h1>
//     <img src=${PROFILE_BASE_URL + actor.profile_path}>
//     <h3>Birthday:</h3>
//     <p>${actor.birthday}</p>
//     <h3>Biography:</h3>
//     <p>${actor.biography}</p>
//     <h3>Gender:</h3>
//     <p>${actor.gender === 1 ? "female" : "male"}</p>
//     <h3>Popularity:</h3>
//     <p>${actor.popularity}</p>
//     <h3>Actor's movies: </h3>
//     <ul id="filmography" class="list-unstyled"></ul>
//   `
  
//   // const actorCreditsUrl = constructUrl(`person/${actor.id}/movie_credits`);
//   // const actorCreditsResponse = await fetch(actorCreditsUrl);
//   // const actorCreditsData = await actorCreditsResponse.json();
  
//   // const movies = actorCreditsData.cast.map(movie => ({
//   //   id: movie.id,
//   //   title: movie.title,
//   //   character: movie.character,
//   //   releaseDate: movie.release_date
//   // }));
 
// // fetch(actorCreditsUrl)
// //   .then((response) => response.json())
// //   .then((creditsData) => {
// //     const movies = creditsData.cast.slice(0, 5);
// //     console.log('Actor Movies:', movies);
// //   })
// //   .catch((error) => {
// //     console.error('Error retrieving actor movies:', error);
// //   });

  
//   // Add more elements and data as needed

//   // You can also fetch and render additional information about the actor,
//   // such as their filmography or biography, using the actor's ID.

//   // Example:
//   // const filmography = await fetchActorFilmography(actorId);
//   // renderFilmography(filmography);
// };

// // Fetch additional information about the actor, such as filmography, if needed
// const fetchActorFilmography = async (actorId) => {
//   // Fetch filmography data using the actor's ID
// };

// // Render filmography data on the page
// // const renderFilmography = (movies) => {
// //   const filmographyList = document.getElementById("filmography");

// //   movies.forEach((movie) => {
// //     const movieItem = document.createElement("li");
// //     movieItem.textContent = movie.title;
// //     filmographyList.appendChild(movieItem);
// //   });
  
// // };
// const renderFilmographyData = (actor) => {
//   const filmographyList = document.getElementById("filmography");

//   actor.movie_credits.cast.slice(0, 5).forEach((movie) => {
//     const filmographyItem = document.createElement("li");
//     filmographyItem.textContent = movie.title;
//     filmographyList.appendChild(filmographyItem);
//   });
// };


// // Call the fetchActor function to retrieve and render the actor's data
// fetchActor();



// import { renderMovie } from './test.js';
// import fetchMovie from "./test.js";
const actorId = new URLSearchParams(window.location.search).get("id");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";

const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=36f366620ade5c54e351a12a48a38a81`;
};

const fetchActor = async () => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/person/${actorId}?api_key=36f366620ade5c54e351a12a48a38a81`);
    const actorData = await response.json();
    renderActor(actorData);
    const actorCreditsUrl = constructUrl(`person/${actorId}/movie_credits`);
    const actorCreditsResponse = await fetch(actorCreditsUrl);
    const actorCreditsData = await actorCreditsResponse.json();
    const movies = actorCreditsData.cast.slice(0, 5);
    renderFilmographyData(movies);
  } catch (error) {
    console.error("Error retrieving actor data:", error);
  }
};

const renderActor = (actor) => {
  const actorContainer = document.getElementById("actor-container");
  actorContainer.innerHTML = `
    <h1>${actor.name}</h1>
    <img src=${PROFILE_BASE_URL + actor.profile_path}>
    <h3>Birthday:</h3>
    <p>${actor.birthday}</p>
    <h3>Biography:</h3>
    <p>${actor.biography}</p>
    <h3>Gender:</h3>
    <p>${actor.gender === 1 ? "female" : "male"}</p>
    <h3>Popularity:</h3>
    <p>${actor.popularity}</p>
    <h3>Actor's movies: </h3>
    <ul id="filmography" class="list-unstyled"></ul>
  `;
};

// const renderFilmographyData = (movies) => {
//   const filmographyList = document.getElementById("filmography");
//   filmographyList.innerHTML = ""; // Clear the previous movie list

//   movies.forEach((movie) => {
//     const filmographyItem = document.createElement("li");
//     filmographyItem.textContent = movie.title;
//     filmographyList.appendChild(filmographyItem);
//   });
// };

const renderFilmographyData = (movies) => {
  
  const filmographyList = document.getElementById("filmography");
  filmographyList.innerHTML = ""; // Clear the previous movie list
  
  movies.forEach((movie) => {
    const filmographyItem = document.createElement("li");
    const filmographyLink = document.createElement("a");
    const filmographyPoster = document.createElement("img");
    
    filmographyPoster.src = PROFILE_BASE_URL + movie.poster_path;
    filmographyLink.textContent = movie.title;
    filmographyItem.addEventListener("click", function(){
      fetchMovie(movie.id)
      .then((movieDetails) => {
        
        renderMovie(movieDetails);
      })
      .catch((error) => {
        console.error("Error retrieving related movie details:", error);
      });
    })

    filmographyItem.appendChild(filmographyPoster);
    filmographyItem.appendChild(filmographyLink);
    filmographyList.appendChild(filmographyItem);
  });
};


fetchActor();
