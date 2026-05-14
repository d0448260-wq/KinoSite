
const API_KEY = "b2ba68b1-6fee-48cd-84ed-cd58be0eb893";
const API_URL = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?page=1";

async function getMovies(page = 1) {
    const moviesEl = document.getElementById("movies-container");
    moviesEl.innerHTML = "<p>Загрузка...</p>"; 

    try {
        const resp = await fetch(API_URL + page, {
            headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY }
        });
        const respData = await resp.json();
        moviesEl.innerHTML = ""; 
        showMovies(respData);
    } catch (err) {
        console.error(err);
        moviesEl.innerHTML = "<p>Ошибка загрузки данных</p>";
    }
}

function showMovies(data) {
    const moviesEl = document.getElementById("movies-container");
    data.items.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            <p class="movie-title">${movie.nameRu || movie.nameEn}</p>
            <div class="movie-details">
                <span>${movie.year} год</span>
                <span>Рейтинг: ${movie.ratingKinopoisk || '8.0'}</span>
            </div>
            <a href="#" class="btn-more">Перейти</a>
        `;
        moviesEl.appendChild(card);
    });
}

document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        getMovies(e.target.dataset.page);
        window.scrollTo({ top: 450, behavior: 'smooth' });
    });
});

getMovies(1);

const burger = document.getElementById('burger-btn');
const nav = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
    nav.classList.toggle('active'); 
    burger.classList.toggle('active'); 
});


const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

function showMovies(data) {
    const moviesEl = document.getElementById("movies-container");
    
    data.items.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        
        const movieId = movie.kinopoiskId || movie.filmId;

        card.innerHTML = `
            <img src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            <p class="movie-title">${movie.nameRu || movie.nameEn}</p>
            <div class="movie-details">
                <span>${movie.year} год</span>
                <span>Рейтинг: ${movie.ratingKinopoisk || '8.0'}</span>
            </div>
            <a href="movie.html?id=${movieId}" class="btn-more">Перейти</a>
        `;
        moviesEl.appendChild(card);
    });
}
