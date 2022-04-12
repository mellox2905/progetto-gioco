var board; // Crea tabella.
var score = 0; // Imposta punteggio.
var rows = 4; // Numero righe.
var columns = 4; // Numero colonne.
// Ottieni elementi per i messaggi di fine gioco.
var messageContainer = document.getElementById("message");
var messageParagraph = document.getElementById("message-p");
var messageSecondary = document.getElementById("message-score");
var rules = document.getElementById("rules");
var hasEnded = false; // Controlla se il gioco è finito.

// Esegui il gioco al caricamento della finestra.
window.onload = function() {
    setGame();
}

// Setup gioco.
function setGame() {
    // Imposta numeri tabella.
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    // Crea le "tiles" iniziali.
    for(r=0;r<rows;r++) {
        for(c=0;c<columns;c++) {
            var tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString(); // Imposta ID del "tile" come "riga-colonna".
            var num = board[r][c]; // Identificativo "tite".
            updateTile(tile, num); // Modifica il "tile".
            document.getElementById("board").append(tile); // Aggiungi "title" alla tabella.
        }
    }
    // Crea due "tiles".
    setTwo();
    setTwo();
}

// Funzione per aggiornare una "tile".
function updateTile(tile, num) {
    // Se non è Game Over, crea "tiles" funzionanti.
    if(!hasEnded) {
        // Resetta le classi del "tile" ogni volta e assegna quelle nuove.
        tile.classList.value = "";
        tile.classList.add("tile");
        if (num > 0) {
            // Dai al "tile" il numero corrispondente.
            tile.innerText = num.toString();
            if (num <= 2048) {
                // Se non hai finito, aggiungi una classe per identificare il tipo di "tile".
                tile.classList.add("x"+num.toString());
            } else {
                // Vittoria!
                messageContainer.classList.add("game-over");
                messageParagraph.innerHTML = "Hai vinto!";
                messageSecondary.innerHTML = "<p class='message-secondary-p'>Punteggio finale: " + score + "</p>";
                hasEnded = true;
                return;
            }
        }    
    }
    // Altrimenti, fermati.
    else {
        return;
    }
}

// Gestione tasti.
document.addEventListener('keyup', (e) => {
    // Se premi freccia sinistra...
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    // Se premi freccia destra...
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    // Se premi freccia su...
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    // Se premi freccia giù...
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    // Mostra il punteggio aggiornato.
    document.getElementById("score").innerText = score;
});

function filterZero(row) {
    return row.filter(num => num != 0); // Gestisci una riga (il numero deve essee diverso da zero!).
}

// Gestisci spostamento.
function slide(row) {
    row = filterZero(row); // Sistema riga.
    for(i=0;i<row.length-1;i++) {
        // Se due facce sono uguali...
        if (row[i] == row[i+1]) {
            row[i] *= 2; // Sfrutta potenze.
            row[i+1] = 0; // Inserisci zero dove necessario.
            score += row[i]; // Aumenta il punteggio.
        }
    }
    row = filterZero(row);
    // Aggiungi zero negli spazi vuoti.
    while (row.length < columns) {
        row.push(0);
    }
    // Mostra nuova riga.
    return row;
}

// Gestisci spostamento a sinistra.
function slideLeft() {
    for(r=0;r<rows;r++) {
        // Prendi riga attuale.
        var row = board[r];
        row = slide(row);
        board[r] = row;
        for(c=0;c<columns;c++) {
            // Modifica ID "tile" e aggiornala con il nuovo numero.
            var tile = document.getElementById(r.toString() + "-" + c.toString());
            var num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// Gestisci spostamento a destra.
function slideRight() {
    for(r=0;r<rows;r++) {
        let row = board[r];
        row.reverse(); // Gira al contrario la riga.
        row = slide(row);
        board[r] = row.reverse();
        for(c=0;c<columns;c++) {
            var tile = document.getElementById(r.toString() + "-" + c.toString());
            var num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// Gestisci spostamento sopra.
function slideUp() {
    for(c=0;c<columns;c++) {
        var row = [board[0][c], board[1][c], board[2][c], board[3][c]]; // Prendi contenuti colonna.
        row = slide(row);
        for(r=0;r<rows;r++) {
            board[r][c] = row[r];
            var tile = document.getElementById(r.toString() + "-" + c.toString());
            var num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// Gestisci spostamento giù.
function slideDown() {
    for(c=0;c<columns;c++) {
        var row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for(r=0;r<rows;r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// Crea il 2 (pollo).
function setTwo() {
    // Se non ci sono spazi vuoti, dai Game Over.
    if (!hasEmptyTile()) {
        messageContainer.classList.add("game-over");
        messageParagraph.innerHTML = "Game Over";
        messageSecondary.innerHTML = "<p class='message-secondary-p'>Punteggio finale: " + score + "</p>";
        rules.style.display = "none";
        hasEnded = true;
        return;
    }
    // Fino a quando non trova uno spazio libero...
    var found = false;
    while (!found) {
        // Genera casualmente la riga e la colonna in cui posizionarsi.
        var r = Math.floor(Math.random() * 4);
        var c = Math.floor(Math.random() * 4);
        // Se quello è spazio ha un "tile" pari a zero, crea lì il 2.
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.classList.add("x2"); // Aggiungi la classe per mostrare il pollo.
            found = true;
        }
    }
}

// Controlla se il "tile" è vuoto.
function hasEmptyTile() {
    for(r=0;r<rows;r++) {
        for(c=0;c<columns;c++) {
            if (board[r][c] == 0) { // Ci deve essere almeno uno zero nella tabella. Il controllo del Game Over lo gestisce poi "setTwo()"".
                return true;
            }
        }
    }
    return false;
}