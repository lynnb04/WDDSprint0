/////////
// api //
/////////

insertPerson()

async function insertPerson() {
    const baseURL = 'https://fdnd.directus.app'
    const endpoint = '/items/person/306'
    const url = baseURL + endpoint

    let response = await fetch(url)
    let person = await response.json()
    let data = person.data

    // polaroid foto
    const polaroid = document.getElementById('profile-polaroid')
    polaroid.innerHTML = `
        <figure>
            <img src="${data.avatar}" alt="Foto van ${data.name}">
            <figcaption class="polaroid-label">${data.name}</figcaption>
        </figure>
    `

    // profiel details
    const details = document.getElementById('profile-details')
    const profileCard = document.getElementById('profile-card')
    
    // gebruik fav_color als accentkleur als deze er is
    if (data.fav_color) {
        profileCard.style.borderTop = `5px solid ${data.fav_color}`
    }

    details.innerHTML = `
        <h2>${data.name} ${data.nickname ? `(${data.nickname})` : ''} ${data.vibe_emoji || ''}</h2>
        <p class="bio">${data.bio || ''}</p>
        
        <div class="detail-grid">
            <div class="detail-row"><span class="detail-icon">📍</span><span>${data.residency || '—'}</span></div>
            <div class="detail-row"><span class="detail-icon">🎮</span><span>${data.fav_game || '—'}</span></div>
            <div class="detail-row"><span class="detail-icon">🐅</span><span>${data.fav_animal || '—'}</span></div>
            <div class="detail-row"><span class="detail-icon">☀️</span><span>${data.fav_season || '—'}</span></div>
            <div class="detail-row"><span class="detail-icon">🥝</span><span>${data.fav_fruit || '—'}</span></div>
            <div class="detail-row"><span class="detail-icon">👟</span><span>Maat ${data.shoe_size || '—'}</span></div>
        </div>

        <div class="detail-footer">
            <div class="detail-row">
                <span class="detail-icon">🐙</span>
                <a href="https://github.com/${data.github_handle}" target="_blank">${data.github_handle}</a>
            </div>
            <div class="detail-row">
                <span class="detail-icon">🎂</span>
                <span>${formatDate(data.birthdate)}</span>
            </div>
        </div>
    `
}

function formatDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
        'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

async function fetchClassmateEmojis() {
    const url = 'https://fdnd.directus.app/items/person?filter[squads][squad_id][tribe][name]=CMD%20Minor%20Web%20Dev&filter[squads][squad_id][cohort]=2526';
    try {
        let response = await fetch(url);
        let result = await response.json();
        let data = result.data;

        // filter op fav emoji
        let withEmoji = data.filter(person => person.fav_emoji && person.fav_emoji.trim() !== '');

        // sorteer op naam
        let classmates = withEmoji.sort((a, b) => a.name.localeCompare(b.name));

        const emojiContainer = document.getElementById('emoji-list');
        if (emojiContainer) {
            emojiContainer.innerHTML = classmates.map(c => `
                <li class="emoji-item">
                    <span class="emoji-icon">${c.fav_emoji}</span>
                    <span class="emoji-name">${c.name || 'Klasgenoot'}</span>
                </li>
            `).join('');
        }
    } catch (err) {
        console.error("Error fetching emojis:", err);
    }
}
fetchClassmateEmojis();


//////////////////////////////////////
// achtergrond dots repeat + resize //
//////////////////////////////////////

const wrapper = document.getElementById('dot-grid')

function createDots() {
    wrapper.innerHTML = ''                                                    // clear bestaande dots

    const dotSize = 10                                                       // berekent hoeveel dots er in de lengte + breedte passen incl gap
    const gap = 10
    const cols = Math.floor(window.innerWidth / (dotSize + gap))
    const rows = Math.floor(window.innerHeight / (dotSize + gap))
    const totalDots = cols * rows                                            // totale dots op de oppervlakte

    for (let i = 0; i < totalDots; i++) {                                    // for-loop, begin bij 0 en blijf herhalen tot i < totalDots. i++ = verhoog i met 1
        const dot = document.createElement('div')                            // maakt html element
        dot.classList.add('dot')                                             // class voor css
        wrapper.appendChild(dot)                                             // plaats dot binnen wrapper op pagina
    }

    wrapper.style.gridTemplateColumns = `repeat(${cols}, ${dotSize}px)`      // update grid
    wrapper.style.gridTemplateRows = `repeat(${rows}, ${dotSize}px)`
}

createDots()

// debounce resize zodat het niet te vaak triggered
let resizeTimer
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(createDots, 200)
})


///////////////////
// theme toggle  //
///////////////////

const themeToggle = document.getElementById('theme-toggle');
const moonIcon = themeToggle.querySelector('.moon-icon');
const sunIcon = themeToggle.querySelector('.sun-icon');

// check opgeslagen thema of voorkeur van browser
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }
});

