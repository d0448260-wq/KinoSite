const API_KEY = "b2ba68b1-6fee-48cd-84ed-cd58be0eb893";
let allActors = [];
let currentActorsPage = 1;
const actorsPerPage = 6; 

const urlParams = new URLSearchParams(window.location.search);
const filmId = urlParams.get('filmId') || 258687; 

async function loadActorsData() {
    try {
        const resp = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${filmId}`, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY
            }
        });
        const data = await resp.json();

        allActors = data
            .filter(person => person.professionKey === "ACTOR")
            .slice(0, 18);

        renderActorsGrid();
        renderRecentActors();
    } catch (err) {
        console.error("Ошибка при загрузке актеров:", err);
    }
}

function addToRecent(actor) {
    let recent = JSON.parse(localStorage.getItem('recentActors')) || [];
    recent = recent.filter(item => item.staffId !== actor.staffId);
    recent.unshift(actor);
    recent = recent.slice(0, 4);
    localStorage.setItem('recentActors', JSON.stringify(recent));
    renderRecentActors();
}

function renderRecentActors() {
    const recentGrid = document.getElementById("recent-actors-grid");
    const recentData = JSON.parse(localStorage.getItem('recentActors')) || [];
    
    if (!recentGrid) return;
    recentGrid.innerHTML = "";

    recentData.forEach(actor => {
        const card = document.createElement("div");
        card.className = "recent-card";
        card.innerHTML = `
            <div class="actor-img-container">
                <img src="${actor.posterUrl}" alt="${actor.nameRu || actor.nameEn}">
            </div>
            <div class="actor-footer">
                <p class="actor-name">${actor.nameRu || actor.nameEn}</p>
            </div>
        `;
        card.onclick = () => {
            window.location.href = `actor-info.html?id=${actor.staffId}`;
        };
        recentGrid.appendChild(card);
    });
}

function renderActorsGrid() {
    const grid = document.getElementById("actors-grid");
    if (!grid) return;

    grid.innerHTML = "";
    const start = (currentActorsPage - 1) * actorsPerPage;
    const end = start + actorsPerPage;
    const pageActors = allActors.slice(start, end);

    pageActors.forEach(actor => {
        const card = document.createElement("div");
        card.classList.add("actor-card");
        card.innerHTML = `
            <div class="actor-img-container">
                <img src="${actor.posterUrl}" alt="${actor.nameRu || actor.nameEn}">
            </div>
            <p class="actor-name">${actor.nameRu || actor.nameEn}</p>
            <button class="btn-more">Перейти</button>
        `;

        card.onclick = () => {
            addToRecent(actor);
            window.location.href = `actor-info.html?id=${actor.staffId}`;
        };

        grid.appendChild(card);
    });
}

window.changeActorsPage = function(page) {
    currentActorsPage = page;
    const buttons = document.querySelectorAll('.page-btn');
    buttons.forEach((btn, index) => {
        index + 1 === page ? btn.classList.add('active') : btn.classList.remove('active');
    });
    renderActorsGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

loadActorsData();