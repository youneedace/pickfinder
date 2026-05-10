
const API_URL = '/api/proxy';

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchPlayer(e.target.value);
            }
        });
    }
});

async function searchPlayer(playerName) {
    if (!playerName) return;

    // Clear the grid and show a loading state if you want
    const dataGrid = document.querySelector('.data-grid');
    // Remove existing non-header rows
    dataGrid.querySelectorAll('.grid-row').forEach(row => row.remove());

    const response = await fetch(`${API_URL}?endpoint=players&search=${playerName}`);
    const playerData = await response.json();

    if (playerData.data && playerData.data.length > 0) {
        const player = playerData.data[0];
        // Now fetch stats for this player
        const statsResponse = await fetch(`${API_URL}?endpoint=season_averages&player_ids[]=${player.id}`);
        const statsData = await statsResponse.json();
        
        if (statsData.data && statsData.data.length > 0) {
            const stats = statsData.data[0];
            // We have a player and their stats, now display them
            displayPlayerInGrid(player, stats);
        } else {
            // Handle case where player is found but has no stats
            displayNoResults();
        }
    } else {
        // Handle case where no player is found
        displayNoResults();
    }
}

function displayPlayerInGrid(player, stats) {
    const dataGrid = document.querySelector('.data-grid');

    // Create rows for different stats
    createStatRow(dataGrid, player, 'Points', stats.pts);
    createStatRow(dataGrid, player, 'Assists', stats.ast);
    createStatRow(dataGrid, player, 'Rebounds', stats.reb);
}

function createStatRow(grid, player, statName, avgStat) {
    const row = document.createElement('div');
    row.className = 'grid-row';

    // Generate placeholder hit rates
    const l5 = Math.floor(Math.random() * 101);
    const l10 = Math.floor(Math.random() * 101);
    const szn = Math.floor(Math.random() * 101);

    row.innerHTML = `
        <div class="grid-cell col-player">
            <img src="https://via.placeholder.com/32" alt="player">
            <div>
                <h4>${player.first_name} ${player.last_name}</h4>
                <p>${player.team.abbreviation} vs OPP</p> <!-- Placeholder for opponent -->
            </div>
        </div>
        <div class="grid-cell col-line">
            <p>${(avgStat - (avgStat / 10)).toFixed(1)} ${statName}</p>
        </div>
        <div class="grid-cell col-apps">
            <img src="https://via.placeholder.com/24" title="PrizePicks" alt="PrizePicks">
            <img src="https://via.placeholder.com/24" title="Underdog" alt="Underdog">
        </div>
        <div class="grid-cell">${avgStat.toFixed(1)}</div>
        <div class="grid-cell ${getHitRateClass(l5)}">${l5}%</div>
        <div class="grid-cell ${getHitRateClass(l10)}">${l10}%</div>
        <div class="grid-cell ${getHitRateClass(szn)}">${szn}%</div>
    `;

    grid.appendChild(row);
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
