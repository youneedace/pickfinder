// The API key is now handled by the backend proxy.
const API_URL = '/api/proxy';

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPlayer(e.target.value);
        }
    });
});

async function searchPlayer(playerName) {
    if (!playerName) return;

    const response = await fetch(`${API_URL}?endpoint=players&search=${playerName}`);
    const data = await response.json();
    displayPlayers(data.data);
}

function displayPlayers(players) {
    const playerPropsGrid = document.querySelector('.player-props-grid');
    playerPropsGrid.innerHTML = '';

    if (!players || players.length === 0) {
        playerPropsGrid.innerHTML = '<p>No players found.</p>';
        return;
    }

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        playerCard.innerHTML = `
            <h3>${player.first_name} ${player.last_name}</h3>
            <p>Team: ${player.team.full_name}</p>
            <p>Position: ${player.position}</p>
            <button class="view-stats-btn" data-player-id="${player.id}">View Stats</button>
        `;
        playerPropsGrid.appendChild(playerCard);
    });

    document.querySelectorAll('.view-stats-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const playerId = e.target.dataset.playerId;
            getPlayerStats(playerId);
        });
    });
}

async function getPlayerStats(playerId) {
    const response = await fetch(`${API_URL}?endpoint=season_averages&player_ids[]=${playerId}`);
    const data = await response.json();
    displayPlayerStats(data.data[0]);
}

function displayPlayerStats(stats) {
    if (!stats) return;
    const playerCard = document.querySelector(`[data-player-id="${stats.player_id}"]`).parentElement;
    let statsDiv = playerCard.querySelector('.player-stats');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.className = 'player-stats';
        playerCard.appendChild(statsDiv);
    }

    statsDiv.innerHTML = `
        <h4>Season Averages</h4>
        <p>Points: ${stats.pts}</p>
        <p>Rebounds: ${stats.reb}</p>
        <p>Assists: ${stats.ast}</p>
        <div class="projections">
            <h5>Projections</h5>
            <p>Points: 18.5 (More/Less) - 60% Hit Rate</p>
            <p>Rebounds: 7.2 (More/Less) - 70% Hit Rate</p>
        </div>
        <div class="trends">
            <h5>Trends (Last 5 Games)</h5>
            <p>Points: 20.1</p>
            <p>Rebounds: 8.0</p>
        </div>
        <div class="injury-status">
            <h5>Injury Status</h5>
            <p>Healthy</p>
        </div>
        <div class="matchup">
            <h5>Matchup</h5>
            <p>vs. Lakers (Rank #15 Def)</p>
        </div>
    `;
}