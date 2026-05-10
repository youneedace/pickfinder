
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('id');

    if (playerId) {
        loadPlayerPageData(playerId);
    }
});

const API_URL = '/api/proxy';

async function loadPlayerPageData(playerId) {
    // Fetch player details and stats simultaneously
    const [playerDetails, playerStats] = await Promise.all([
        fetch(`${API_URL}?endpoint=players/${playerId}`).then(res => res.json()),
        fetch(`${API_URL}?endpoint=stats&player_ids[]=${playerId}&per_page=10`).then(res => res.json())
    ]);

    // Populate Header
    document.getElementById('player-name').textContent = `${playerDetails.first_name} ${playerDetails.last_name}`;
    document.getElementById('player-details').textContent = `${playerDetails.position} ${playerDetails.height_feet}'${playerDetails.height_inches}"`;
    // NOTE: Real player photos are not available from the API. Using a placeholder.
    // You would need to map player IDs to a photo source like the NBA's CDN.
    // document.getElementById('player-photo').src = `https://cdn.nba.com/headshots/nba/latest/1040x760/${nbaPlayerId}.png`;

    // Populate Chart and Supporting Stats
    if (playerStats.data && playerStats.data.length > 0) {
        const gameLogs = playerStats.data.reverse(); // Oldest to newest
        const line = 24.5; // Demo line for Pts+Rebs

        renderGameLogChart(gameLogs, line);
        renderSupportingStats(gameLogs);
    }
}

function renderGameLogChart(gameLogs, line) {
    const chartContainer = document.getElementById('game-log-chart');
    chartContainer.innerHTML = ''; // Clear previous chart

    const maxStat = Math.max(...gameLogs.map(log => log.pts + log.reb), line) * 1.2;

    gameLogs.forEach(log => {
        const totalStat = log.pts + log.reb;
        const barHeight = (totalStat / maxStat) * 100;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';

        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        if (totalStat < line) {
            bar.classList.add('miss');
        }
        bar.style.height = `${barHeight}%`;
        bar.title = `${totalStat} Pts+Rebs`;

        const label = document.createElement('p');
        label.className = 'chart-bar-label';
        const gameDate = new Date(log.game.date);
        label.textContent = `${gameDate.getMonth() + 1}/${gameDate.getDate()}`;

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chartContainer.appendChild(barContainer);
    });
}

function renderSupportingStats(gameLogs) {
    const grid = document.getElementById('supporting-stats-grid');
    grid.innerHTML = '';

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const stats = {
        'Minutes': avg(gameLogs.map(g => parseFloat(g.min) || 0)).toFixed(1),
        'Points': avg(gameLogs.map(g => g.pts)).toFixed(1),
        'Rebounds': avg(gameLogs.map(g => g.reb)).toFixed(1),
        'Assists': avg(gameLogs.map(g => g.ast)).toFixed(1),
        'FG Made': avg(gameLogs.map(g => g.fgm)).toFixed(1),
        '3PT Made': avg(gameLogs.map(g => g.fg3m)).toFixed(1),
    };

    for (const [key, value] of Object.entries(stats)) {
        const item = document.createElement('div');
        item.className = 'stat-item';
        item.innerHTML = `<p>${key}</p><h4>${value}</h4>`;
        grid.appendChild(item);
    }
}
