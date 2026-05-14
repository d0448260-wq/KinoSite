const API_KEY = "b2ba68b1-6fee-48cd-84ed-cd58be0eb893";
const urlParams = new URLSearchParams(window.location.search);
const actorId = urlParams.get('id');

async function getActorInfo() {
    if (!actorId) return;

    try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff/${actorId}`, {
            headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        renderActor(data);
    } catch (err) {
        console.error("Ошибка API:", err);
    }
}

function renderActor(actor) {
    const content = document.getElementById('actor-detail-content');
    
    content.innerHTML = `
        <div class="actor-dossier">
            <div class="actor-dossier__image">
                <img src="${actor.posterUrl}" alt="${actor.nameRu}">
            </div>
            <div class="actor-dossier__info">
                <h1 class="actor-dossier__name">${actor.nameRu || actor.nameEn}</h1>
                <p class="actor-dossier__name-en">${actor.nameEn || ''}</p>
                
                <ul class="actor-dossier__details">
                    <li><strong>Профессия:</strong> <span>${actor.profession || '—'}</span></li>
                    <li><strong>Дата рождения:</strong> <span>${actor.birthday || '—'}</span></li>
                    <li><strong>Место рождения:</strong> <span>${actor.birthplace || '—'}</span></li>
                    <li><strong>Всего фильмов:</strong> <span>${actor.films ? actor.films.length : 0}</span></li>
                </ul>

                <a href="index.html" class="btn-back">← Вернуться назад</a>
            </div>
        </div>
    `;
}

getActorInfo();