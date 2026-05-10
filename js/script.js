
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchPlayer(e.target.value);
            }
        });
        // Load initial players
        loadAllPlayers();
    }
});

const API_URL = '/api/proxy';

async function loadAllPlayers(page = 0) {
    const response = await fetch(`${API_URL}?endpoint=players&page=${page}&per_page=25`);
    const playerData = await response.json();
    if (playerData.data) {
        displayPlayersInGrid(playerData.data);
    }
}

async function searchPlayer(playerName) {
    if (!playerName) {
        loadAllPlayers(); // if search is cleared, load all players
        return;
    }
    const response = await fetch(`${API_URL}?endpoint=players&search=${playerName}`);
    const playerData = await response.json();
    displayPlayersInGrid(playerData.data || []);
}

function displayPlayersInGrid(players) {
    const dataGrid = document.querySelector('.data-grid');
    // Clear only the rows, not the header
    dataGrid.querySelectorAll('.grid-row').forEach(row => row.remove());

    if (players.length === 0) {
        displayNoResults();
        return;
    }

    players.forEach(player => {
        const row = document.createElement('a'); // Change div to an anchor tag
        row.className = 'grid-row';
        row.href = `player.html?id=${player.id}`; // Link to the player detail page

        // Using placeholders for stats as we don't have them on the main grid yet
        const l5 = Math.floor(Math.random() * 101);
        const l10 = Math.floor(Math.random() * 101);
        const szn = Math.floor(Math.random() * 101);
        const avgL10 = (Math.random() * 30).toFixed(1);

        row.innerHTML = `
            <div class="grid-cell col-player">
                <img src="https://via.placeholder.com/32" alt="player">
                <div>
                    <h4>${player.first_name} ${player.last_name}</h4>
                    <p>${player.team.abbreviation}</p>
                </div>
            </div>
            <div class="grid-cell col-line">
                <p>${(avgL10 - (avgL10 / 10)).toFixed(1)} Pts</p> <!-- Example line -->
            </div>
            <div class="grid-cell col-apps">
                <img src="https://a.espncdn.com/i/sportsbook/logo-draftkings-44.png" title="DraftKings" alt="DraftKings">
            </div>
            <div class="grid-cell">${avgL10}</div>
            <div class="grid-cell ${getHitRateClass(l5)}">${l5}%</div>
            <div class="grid-cell ${getHitRateClass(l10)}">${l10}%</div>
            <div class="grid-cell ${getHitRateClass(szn)}">${szn}%</div>
        `;
        dataGrid.appendChild(row);
    });
}

function getHitRateClass(rate) {
    if (rate >= 70) return 'hit-rate-high';
    if (rate >= 50) return 'hit-rate-mid';
    return 'hit-rate-low';
}

function displayNoResults() {
    const dataGrid = document.querySelector('.data-grid');
    const noResultsRow = document.createElement('div');
    noResultsRow.className = 'grid-row';
    noResultsRow.innerHTML = '<div class="grid-cell" style="grid-column: 1 / -1; justify-content: center;">No results found.</div>';
    dataGrid.appendChild(noResultsRow);
}
