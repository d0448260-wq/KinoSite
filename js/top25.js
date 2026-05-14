const API_KEY = "b2ba68b1-6fee-48cd-84ed-cd58be0eb893";
const API_TOP_250 = "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES";

let allMovies = [];      
let filteredMovies = []; 
let currentPage = 1;

async function loadTop25() {
    try {
        const resp = await fetch(API_TOP_250, {
            headers: { 
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY 
            }
        });
        const data = await resp.json();
        
        allMovies = data.items.slice(0, 25);
        filteredMovies = [...allMovies]; 
        
        renderMovies();
    } catch (err) {
        console.error("Ошибка при загрузке ТОП-25:", err);
    }
}


function renderMovies() {
    const container = document.getElementById("top-movies-list");
    if (!container) return;
    
    container.innerHTML = "";

    let itemsPerPage = 10;
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage; 

    const moviesToDisplay = filteredMovies.slice(start, end);

    if (moviesToDisplay.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding: 50px;'>Фильмы не найдены. Попробуйте сбросить фильтры.</p>";
        return;
    }

    moviesToDisplay.forEach((movie, index) => {
        const globalIndex = start + index + 1;
        const rankClass = globalIndex <= 3 ? "rank-blue" : "rank-black";

        const card = document.createElement("div");
        card.classList.add("top-card");
        
        card.innerHTML = `
            <div class="rank-number ${rankClass}">${globalIndex}</div>
            <img src="${movie.posterUrlPreview}" class="top-poster" alt="${movie.nameRu || 'Постер'}">
            <div class="top-info">
                <h3>${movie.nameRu || movie.nameEn}</h3>
                <p class="top-desc">${movie.description || 'Описание подгружается...'}</p>
                <p class="top-rating-mobile">Рейтинг: ${movie.ratingKinopoisk || '—'}</p>
            </div>
            <div class="top-stats">
                <p>Год выпуска: <b>${movie.year || '—'}</b></p>
                <p>Возраст: <b>16+</b></p>
                <p>Рейтинг: <b style="color: #26C3D1;">${movie.ratingKinopoisk || '—'}</b></p>
                <p>Длительность: <b>${movie.filmLength ? movie.filmLength + ' мин' : '—'}</b></p>
            </div>
        `;
        
        card.onclick = () => {
            window.location.href = `movie.html?id=${movie.kinopoiskId}`;
        };

        container.appendChild(card);
    });
}
window.changePage = function(page) {
    currentPage = page;
    
    document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.page-btn:nth-child(${page})`);
    if (activeBtn) activeBtn.classList.add('active');

    renderMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function applyFilters() {
    const nameVal = document.getElementById('search-name').value.toLowerCase();
    const yearVal = document.getElementById('search-year').value;

    filteredMovies = allMovies.filter(movie => {
        const matchesName = (movie.nameRu || "").toLowerCase().includes(nameVal) || 
                            (movie.nameEn || "").toLowerCase().includes(nameVal);
        const matchesYear = yearVal === "" || movie.year == yearVal;
        
        return matchesName && matchesYear;
    });

    currentPage = 1;
    renderMovies();
}

document.getElementById('search-name')?.addEventListener('input', applyFilters);
document.getElementById('search-year')?.addEventListener('input', applyFilters);

loadTop25();