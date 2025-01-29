let players = [];
let originalPlayers = []; // Liste de joueurs originale pour garder les mêmes joueurs à chaque relance
let teams = [];
let teamNames = [];

function addPlayer() {
    const playerNameInput = document.getElementById("playerName");
    const playerName = playerNameInput.value.trim();
    if (playerName && !players.includes(playerName)) {
        players.push(playerName);
        originalPlayers.push(playerName); // Ajout également dans la liste originale pour pouvoir la restaurer
        updatePlayersList();
    }
    playerNameInput.value = "";
}

function updatePlayersList() {
    const playersList = document.getElementById("playersList");
    playersList.innerHTML = "";
    playersList.textContent = players.join(", ");
}

function startDraw() {
    const teamsCount = parseInt(document.getElementById("teamsCount").value);
    const mode = document.getElementById("mode").value;
    const captainsInput = document.getElementById("captains").value.trim();
    const teamNamesInput = document.getElementById("teamNames").value.trim();

    // Si aucun joueur n'est ajouté, on ne peut pas lancer de tirage
    if (players.length === 0) {
        alert("Aucun joueur n'a été ajouté !");
        return;
    }

    // Réinitialiser les équipes et réassigner les joueurs à partir de la liste originale
    players = [...originalPlayers]; // On réinitialise la liste des joueurs
    teams = new Array(teamsCount).fill(null).map(() => []);

    let captains = captainsInput ? captainsInput.split(",").map(name => name.trim()) : [];
    let teamNames = teamNamesInput ? teamNamesInput.split(",").map(name => name.trim()) : [];

    if (teamNames.length > 0 && teamNames.length !== teamsCount) {
        alert("Le nombre de noms d'équipes doit correspondre au nombre d'équipes !");
        return;
    }

    shuffleArray(captains); // Mélange des capitaines
    shuffleArray(players); // Mélange des joueurs

    // Assigner les capitaines aux équipes
    captains.forEach((captain, index) => {
        if (players.includes(captain)) {
            teams[index].push(captain);
            players = players.filter(player => player !== captain); // Retirer le capitaine des joueurs restants
        }
    });

    // Ajouter les autres joueurs dans les équipes
    let teamIndex = 0;
    players.forEach(player => {
        teams[teamIndex].push(player);
        teamIndex = (teamIndex + 1) % teamsCount;
    });

    displayResults(teamNames); // Afficher les résultats
}

function displayResults(teamNames) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    teams.forEach((team, index) => {
        setTimeout(() => {
            const teamDiv = document.createElement("div");
            const teamTitle = teamNames.length > 0 ? teamNames[index] : `Équipe ${index + 1}`;
            teamDiv.innerHTML = `<h3>${teamTitle}</h3><ul id="team-${index}"></ul>`;
            resultDiv.appendChild(teamDiv);

            const teamList = document.getElementById(`team-${index}`);
            team.forEach((player, i) => {
                setTimeout(() => {
                    let listItem = document.createElement("li");
                    listItem.textContent = "🎲 ..."; // Affichage initial
                    teamList.appendChild(listItem);

                    let randomInterval = setInterval(() => {
                        listItem.textContent = players[Math.floor(Math.random() * players.length)]; // Défilement rapide des noms
                    }, 100);

                    setTimeout(() => {
                        clearInterval(randomInterval);
                        listItem.textContent = player; // Affichage final du bon joueur
                    }, 10000); // 10 secondes de suspense
                }, i * 2500); // Défilement joueur par joueur
            });
        }, index); // Pause entre chaque équipe
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fonction pour gérer l'événement ENTER
function handleEnterKey(event, callback) {
    if (event.key === "Enter") {
        callback();
    }
}

// Fonction pour afficher les confettis
function loadConfetti() {
    const confettiWrapper = document.querySelector('.confetti-wrapper');
    // Generate confetti
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.setProperty('--fall-duration', `${Math.random() * 3 + 3}s`);
        confetti.style.setProperty('--confetti-color', getRandomColor());
        confettiWrapper.appendChild(confetti);
    }

    function getRandomColor() {
        const colors = ['#ff6347', '#ffa500', '#32cd32', '#1e90ff', '#ff69b4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Ajouter un écouteur d'événement pour "ENTER" dans les champs de texte
document.getElementById("playerName").addEventListener("keydown", (event) => handleEnterKey(event, addPlayer));
document.getElementById("teamsCount").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));
document.getElementById("teamNames").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));
document.getElementById("mode").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));
document.getElementById("captains").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));