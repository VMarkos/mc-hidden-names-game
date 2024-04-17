const SECRETS = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Florence",
    "George",
    "Harry",
    "Ian",
];

let SECRET_ORDER = [...Array(9).keys()];

let SECRET_QUEUE = [...Array(9).keys()];

const CACHE = {
    "SECRET_QUEUE": [],
    "SECRET_ORDER": [],
};

let CURRENT_INDEX = -1;

let GUESS_SUBMITTED = true;

let GAME_STARTED = false;

function initCards() {
    const cardsContainer = document.getElementById("game-grid");
    let card;
    for (const i of SECRET_ORDER) {
        card = createCard(i, SECRETS[i]);
        cardsContainer.append(card);
    }
}

function hideCards() {
    let i = 0;
    for (const card of document.getElementsByClassName("grid-card")) {
        card.textContent = "" + (++i);
    }
}

function startGame(restart = false) {
    const guess = document.getElementById("guess");
    guess.disabled = true;
    CURRENT_INDEX = SECRET_QUEUE.pop();
    setTimeout(() => {
        hideCards();
        GAME_STARTED = true;
        toggleCard(`radio-${CURRENT_INDEX}`);
        guess.disabled = false;
        guess.focus();
    }, restart ? 0 : 5000);
}

function unveilCard(index) {
    document.getElementById(`card-${index}`).textContent = SECRETS[index];
}

function submitGuess(event) {
    if (!GAME_STARTED) {
        return;
    }
    const guess = document.getElementById("guess").value;
    if (guess !== SECRETS[CURRENT_INDEX]) {
        alert("You lost! A new game will start now!");
        windowInit(false);
    } else if (SECRET_QUEUE.length === 0) {
        alert("You won!");
        windowInit();
    } else {
        unveilCard(CURRENT_INDEX);
        CURRENT_INDEX = SECRET_QUEUE.pop();
        toggleCard(`radio-${CURRENT_INDEX}`);
        document.getElementById("guess").value = "";
    }
    document.getElementById("guess").focus();
}

function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }  
    return array;
  }

function toggleCard(cardId) {
    const card = document.getElementById(cardId);
    const contentIndex = parseInt(cardId.slice(-1, -2)) + 1;
    if (!card.checked) {
        card.textContent = contentIndex;
        card.checked = true;
    } else {
        card.textContent = SECRETS[contentIndex - 1];
        // card.checked = false;
    }
}

function createCard(index, content) {
    const cardContainer = document.createElement("div");
    const cardRadio = document.createElement("input");
    const cardLabel = document.createElement("label");
    cardRadio.classList.add("radio-hack");
    cardRadio.id = `radio-${index}`;
    cardRadio.type = "radio";
    cardRadio.name = "radio-hack"
    cardLabel.id = `card-${index}`;
    cardLabel.classList.add("grid-card");
    cardLabel.textContent = content;
    cardLabel.setAttribute("for", cardRadio.id);
    cardContainer.append(cardRadio);
    cardContainer.append(cardLabel);
    return cardContainer;
}

function attachEventListeners() {
    document.getElementById("go-button").addEventListener("click", submitGuess);
}

function windowInit(won = true) {
    GAME_STARTED = false;
    if (won) {
        SECRET_ORDER = shuffle([...Array(9).keys()]);
        SECRET_QUEUE = shuffle([...Array(9).keys()]);
        CACHE["SECRET_QUEUE"] = [...SECRET_QUEUE];
        CACHE["SECRET_ORDER"] = [...SECRET_ORDER];
    } else {
        SECRET_ORDER = [...CACHE["SECRET_ORDER"]];
        SECRET_QUEUE = [...CACHE["SECRET_QUEUE"]];
    }
    document.getElementById("game-grid").innerHTML = "";
    document.getElementById("guess").value = "";
    attachEventListeners();
    initCards();
    startGame(!won);
}

window.addEventListener("load", windowInit);