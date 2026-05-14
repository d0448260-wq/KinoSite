
const API_KEY = "b2ba68b1-6fee-48cd-84ed-cd58be0eb893";
const API_URL_MOVIE = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const API_URL_STAFF = "https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.2/films?yearFrom=";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function getFullMovieData() {
    if (!movieId) {
        console.error("ID фильма не найден в URL");
        return;
    }

    try {
        const movieResp = await fetch(API_URL_MOVIE + movieId, {
            headers: { 
                "Content-Type": "application/json", 
                "X-API-KEY": API_KEY 
            }
        });
        const movieData = await movieResp.json();

        const staffResp = await fetch(API_URL_STAFF + movieId, {
            headers: { 
                "Content-Type": "application/json", 
                "X-API-KEY": API_KEY 
            }
        });
        const staffData = await staffResp.json();

        const relatedResp = await fetch(`${API_URL_SEARCH}${movieData.year}&yearTo=${movieData.year}&order=RATING&type=ALL&page=1`, {
            headers: { 
                "Content-Type": "application/json", 
                "X-API-KEY": API_KEY 
            }
        });
        const relatedData = await relatedResp.json();

        renderMoviePage(movieData, staffData);
        renderRelatedMovies(relatedData.items, movieData.kinopoiskId);

    } catch (err) {
        console.error("Ошибка при работе с API:", err);
    }
}

function renderMoviePage(movie, staff) {

    document.getElementById("movie-title").innerText = movie.nameRu || movie.nameEn;
    document.getElementById("movie-desc").innerText = movie.description || "Описание временно отсутствует.";
    
    const posterImg = document.getElementById("movie-img");
    posterImg.src = movie.posterUrl;
    posterImg.alt = movie.nameRu || "Постер";

    document.getElementById("movie-year").innerText = movie.year;
    document.getElementById("movie-rating").innerText = movie.ratingKinopoisk || movie.ratingImdb || "—";
    document.getElementById("movie-runtime").innerText = movie.filmLength ? `${movie.filmLength} мин` : "—";
    document.getElementById("movie-genre").innerText = movie.genres.map(g => g.genre).join(" / ");
    
    const ageLimit = movie.ratingAgeLimits ? movie.ratingAgeLimits.replace('age', '') + '+' : '16+';
    document.getElementById("movie-age").innerText = ageLimit;

    const ratingValue = Math.round(movie.ratingKinopoisk || 0);
    const stars = document.querySelectorAll(".star");
    stars.forEach((star, index) => {
        if (index < ratingValue) {
            star.classList.add("active");
        }
    });

    const castList = document.getElementById("movie-cast");
    castList.innerHTML = "";
    
    const actors = staff
        .filter(person => person.professionKey === "ACTOR")
        .slice(0, 10);

    actors.forEach(actor => {
        const li = document.createElement("li");
        li.innerText = actor.nameRu || actor.nameEn;
        castList.appendChild(li);
    });
}

function renderRelatedMovies(movies, currentId) {
    const relatedContainer = document.getElementById("related-container");
    if (!relatedContainer) return;
    
    relatedContainer.innerHTML = "";

    const filtered = movies
        .filter(m => m.kinopoiskId !== currentId)
        .slice(0, 4);

    filtered.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            <p class="movie-title">${movie.nameRu || movie.nameEn}</p>
            <div class="movie-details">
                <span>${movie.year} год</span>
                <span>Рейтинг: ${movie.ratingKinopoisk || '—'}</span>
            </div>
            <a href="movie.html?id=${movie.kinopoiskId}" class="btn-more">Перейти</a>
        `;
        relatedContainer.appendChild(card);
    });
}

getFullMovieData();