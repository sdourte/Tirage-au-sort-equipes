// Tableau pour stocker les noms des joueurs
let players = [];
// Tableau pour stocker les équipes créées
let teams = [];
// Tableau pour stocker les noms des équipes si spécifiés
let teamNames = [];

/* Fonction pour ajouter un joueur à la liste */
function addPlayer() {
    const playerNameInput = document.getElementById("playerName");
    const playerName = playerNameInput.value.trim(); // Récupère le nom du joueur
    if (playerName && !players.includes(playerName)) { // Vérifie si le nom est valide et non déjà dans la liste
        players.push(playerName); // Ajoute le joueur à la liste
        updatePlayersList(); // Met à jour l'affichage de la liste des joueurs
    }
    playerNameInput.value = ""; // Vide le champ de texte
}

/* Fonction pour mettre à jour l'affichage de la liste des joueurs */
function updatePlayersList() {
    const playersList = document.getElementById("playersList");
    playersList.innerHTML = ""; // Vide l'élément avant de le remplir
    playersList.textContent = players.join(", "); // Affiche tous les joueurs sous forme de liste séparée par des virgules
}

/* Fonction pour démarrer le tirage au sort */
function startDraw() {
    const teamsCount = parseInt(document.getElementById("teamsCount").value); // Récupère le nombre d'équipes
    const mode = document.getElementById("mode").value; // Récupère le mode sélectionné
    const captainsInput = document.getElementById("captains").value.trim(); // Récupère les noms des capitaines
    const teamNamesInput = document.getElementById("teamNames").value.trim(); // Récupère les noms des équipes

    // Vérifie s'il y a assez de joueurs pour créer les équipes
    if (players.length < teamsCount) {
        alert("Pas assez de joueurs pour former ce nombre d'équipes !");
        return;
    }

    // Sépare les capitaines et noms des équipes s'ils sont fournis
    let captains = captainsInput ? captainsInput.split(",").map(name => name.trim()) : [];
    let teamNames = teamNamesInput ? teamNamesInput.split(",").map(name => name.trim()) : [];
    if (teamNames.length > 0 && teamNames.length !== teamsCount) {
        alert("Le nombre de noms d'équipes doit correspondre au nombre d'équipes !");
        return;
    }

    // Mélange les joueurs
    shuffleArray(players);

    // Crée un tableau vide pour les équipes
    teams = new Array(teamsCount).fill(null).map(() => []);

    // Ajoute les capitaines aux équipes
    captains.forEach((captain, index) => {
        if (players.includes(captain) && teams[index]) {
            teams[index].push(captain);
            players = players.filter(player => player !== captain);
        }
    });

    // Distribue les joueurs restants dans les équipes
    let teamIndex = 0;
    players.forEach(player => {
        teams[teamIndex].push(player);
        teamIndex = (teamIndex + 1) % teamsCount;
    });

    // Affiche les résultats
    displayResults(teamNames);
}

/* Fonction pour afficher les résultats */
function displayResults(teamNames) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Vide la section des résultats avant de la remplir

    teams.forEach((team, index) => {
        setTimeout(() => {
            const teamDiv = document.createElement("div");
            const teamTitle = teamNames.length > 0 ? teamNames[index] : `Équipe ${index + 1}`; // Utilise les noms d'équipes si fournis
            teamDiv.innerHTML = `<h3>${teamTitle}</h3><ul id="team-${index}"></ul>`; // Crée un élément pour l'équipe
            resultDiv.appendChild(teamDiv);

            const teamList = document.getElementById(`team-${index}`);
            team.forEach((player, i) => {
                setTimeout(() => {
                    let listItem = document.createElement("li");
                    listItem.textContent = "🎲 ..."; // Texte initial pour créer le suspense
                    teamList.appendChild(listItem);

                    let randomInterval = setInterval(() => {
                        listItem.textContent = players[Math.floor(Math.random() * players.length)]; // Défilement des noms
                    }, 100); // Intervalle plus court pour un défilement plus rapide

                    setTimeout(() => {
                        clearInterval(randomInterval); // Arrête le défilement
                        listItem.textContent = player; // Affiche le nom du joueur final
                    }, 2000); // 2 secondes de suspense avant de montrer le nom final
                }, i * 2500); // Délai entre chaque joueur
            });
        }, index); // Pause entre l'affichage de chaque équipe
    });
}

/* Fonction pour mélanger un tableau */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange les éléments pour les mélanger
    }
}

/* Fonction pour gérer l'événement ENTER dans les champs */
function handleEnterKey(event, callback) {
    if (event.key === "Enter") {
        callback(); // Déclenche la fonction si la touche Enter est pressée
    }
}

// Ajouter des écouteurs d'événements pour les champs de texte, pour gérer l'enter et ajouter les joueurs
document.getElementById("playerName").addEventListener("keydown", (event) => handleEnterKey(event, addPlayer));
document.getElementById("teamsCount").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));
document.getElementById("teamNames").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));
document.getElementById("mode").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));
document.getElementById("captains").addEventListener("keydown", (event) => handleEnterKey(event, startDraw));
