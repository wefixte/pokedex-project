// Description: This file is responsible for fetching and displaying the list of pokemons.

// Constants
const MAX_POKEMON = 151;
const listWrapper = document.querySelector('.list');
const searchInput = document.querySelector('.search-input');
const NoFound = document.querySelector('.search-no-found');
const paginationContainer = document.querySelector('.pagination');

// Variables
let allPokemons = [];
const limitPerPage = 12;
let currentPage = 1;
let totalPages = Math.ceil(MAX_POKEMON / limitPerPage);


// Function that fetches all pokemons
function loadAllPokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
        .then(response => response.json())
        .then(data => {
            allPokemons = data.results;
            loadPokemons(currentPage);
        })
        .catch(error => console.error("Error loading all pokemons:", error));
}

// Function that fetches pokemons based on the page number
async function loadPokemons(page) {
    const offset = (page - 1) * limitPerPage;
    const alreadyLoadedPokemons = (page - 1) * limitPerPage;
    const remainingPokemons = Math.min(MAX_POKEMON - alreadyLoadedPokemons, limitPerPage);

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${remainingPokemons}`);
        const data = await response.json();
        const pokemons = data.results;
        displayPokemons(pokemons);
    } catch (error) {
        console.error("Error loading pokemons:", error);
    }
}

// Function that displays pagination buttons
function displayPaginationButtons() {
    paginationContainer.innerHTML = '';

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                loadPokemons(currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }
}

// Event listener that loads all pokemons when the window is loaded
window.addEventListener('load', () => {
    loadAllPokemons();
});

// Function that fetches a specific pokemon based on the id
async function fetchPokemons(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon?limit=${id}`).then(response => response.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(response => response.json())
        ]);
        return { pokemon, pokemonSpecies };
    } catch (error) {
        console.error("Error - failed to fetch pokemon:", error);
    }
}

// Function that displays the list of pokemons
function displayPokemons(pokemons) {
    listWrapper.innerHTML = '';

    pokemons.forEach((pokemon) => {
        const pokemonID = pokemon.url.split('/')[6];
        const listItem = document.createElement('div');
        listItem.className = "list-item";

        listItem.innerHTML = `
            <div class="pokemon-wrapper">
                <div class="image-wrapper">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonID}.png" alt="${pokemon.name}">
                </div>
                <div class="num-wrapper">
                    <p class="">#${pokemonID}</p>
                </div>
                <div class="name-wrapper">
                    <p class="name">${pokemon.name}</p>
                </div>
            </div>
        `;

		// Event listener that listens for a click on a pokemon
        listItem.addEventListener('click', async () => {
            const { pokemon, pokemonSpecies } = await fetchPokemons(pokemonID);
            if (pokemon && pokemonSpecies) {
                window.location.href = `focus.html?id=${pokemonID}`;
            }
        });
        listWrapper.appendChild(listItem);
    });
}

// Event listener that listens for input in the search input field
searchInput.addEventListener('input', doSearch);

// Function that filters the pokemons based on the search input
function doSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        loadPokemons(1);
        return;
    }

    const filteredPokemons = allPokemons.filter(pokemon => {
        const pokemonID = pokemon.url.split('/')[6];
        return pokemonID.startsWith(searchTerm) || pokemon.name.toLowerCase().startsWith(searchTerm);
    });

    displayPokemons(filteredPokemons);
    NoFound.style.display = filteredPokemons.length === 0 ? 'block' : 'none';
}

// Function that displays the pagination buttons
displayPaginationButtons();
