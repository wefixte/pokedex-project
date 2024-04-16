const MAX_POKEMON = 151;
const listWrapper = document.querySelector('.list');
const searchInput = document.querySelector('.search-input');
const NoFound = document.querySelector('.search-no-found');

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
	allPokemons = data.results;
	displayPokemons(allPokemons);
});

async function fetchPokemons(pokemons) {
	try {
		const [pokemon, pokemonSpecies] = 
		await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon?limit=${id}`)
		.then((response) => response.json()),
		fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
		.then((response) => response.json()),
	])
	return true
	}	catch (error) {
		console.error("error - failed to fetch pokemon");
	}
}

function displayPokemons(pokemons) {
	listWrapper.innerHTML = '';

	pokemons.forEach((pokemon) => {
		const pokemonID = pokemon.url.split('/')[6];
		const listItem = document.createElement('div');
		listItem.className = "list-item";

		listItem.innerHTML = `
			<div class="num-wrapper">
				<p class="">#${pokemonID}</p>
			</div>
			<div class="image-wrapper">
				<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonID}.png" alt="${pokemon.name}">
			</div>
			<div class="name-wrapper">
				<p class="name">${pokemon.name}</p>
			</div>
		`;

		listItem.addEventListener('click', async () => {
			const success = await fetchPokemons(pokemonID);
			if (success) {
				window.location.href = `details.html?id=${pokemonID}`;
			}
		});
		listWrapper.appendChild(listItem);
	});
}
