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

async function fetchPokemons(id) {
	try {
		const [pokemon, pokemonSpecies] = 
		await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon?limit=${id}`)
		.then((response) => response.json()),
		fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
		.then((response) => response.json()),
	])
	return { pokemon, pokemonSpecies };
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
			const { pokemon, pokemonSpecies } = await fetchPokemons(pokemonID);
			if (pokemon && pokemonSpecies) {
				window.location.href = `focus.html?id=${pokemonID}`;
			}
		});
		listWrapper.appendChild(listItem);
	});
}

searchInput.addEventListener('input', (doSearch));

function doSearch() {
	const searchTerm = searchInput.value.toLowerCase();
	let filteredPokemons;

	filteredPokemons = allPokemons.filter((pokemon) => {
		const pokemonID = pokemon.url.split('/')[6];
		return pokemonID.startsWith(searchTerm) || pokemon.name.toLowerCase().includes(searchTerm);
	});

	displayPokemons(filteredPokemons);

	if (filteredPokemons.length === 0) {
		NoFound.style.display = 'block';
	} else {
		NoFound.style.display = 'none';
	}
}
