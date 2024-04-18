let currentPokemonId = null;

// Load the pokemon data from the API and display it or redirect to home page
document.addEventListener("DOMContentLoaded", () => {
	const MAX_POKEMONS = 151;
	const pokemonID = new URLSearchParams(window.location.search).get("id");
	const id = parseInt(pokemonID, 10);

	// ID validation check | Redirect to index.html if invalid
	if (id < 1 || id > MAX_POKEMONS) {
		return(window.location.href = "index.html");
	}

	currentPokemonId = id;
	loadPokemon(id);
});


async function loadPokemon(id) {
	try {
		const [pokemon, pokemonSpecies] = await Promise.all([
			fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
			fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
		]);

		if (currentPokemonId === id) {
			displayPokemon(pokemon);

			// Display the pokemon description
			const descriptionText = getEnglishDescriptionText (pokemonSpecies);
			document.querySelector(".description").textContent = descriptionText ;

			// Add event listeners to the arrows
			const [arrowLeft, arrowRight] = ["#arrow-left", "#arrow-right"].map((arrows) => document.querySelector(arrows));
			if (id !== 1) {
				arrowLeft.addEventListener("click", () => loadOtherPokemon(id - 1));
			}
			if (id !== 151) {
			arrowRight.addEventListener("click", () => loadOtherPokemon(id + 1));
			}

			// Update the URL
			window.history.pushState({}, "", `?id=${id}`);
		}

	} catch (error) {
		console.error(error);
		return false
	}
}


// Function to display the pokemon data
function displayPokemon(pokemon) {
	// Destructuring des données du Pokémon
	const { name, id, types, weight, height, abilities, stats } = pokemon;

	// Display name and ID
	document.querySelector(".name").textContent = name;
	document.querySelector(".id").textContent = `#${String(id).padStart(3, "0")}`;

	// Display image
	const img = document.querySelector(".detail-img img");
	img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
	img.alt = name;

	// Display height and weight
	document.querySelector(".height").textContent = `${weight / 10}kg`;
	document.querySelector(".weight").textContent = `${height / 10}m`;

	// Display stats
	const statNameMapping = {
		hp: "HP",
		attack: "Attack",
		defense: "Defense",
		speed: "Speed",
		"special-attack": "Special Attack",
		"special-defense": "Special Defense",
	}; 

	// Loop through the stats and update the progress bars
    stats.forEach(({ stat, base_stat }) => {
        const statName = statNameMapping[stat.name];
        const progressValue = base_stat;
        const progressMax = 100;

		// Update the value in the progress bar for each stat
        const statsWrap = document.querySelector(`.stats-wrap[data-stat="${statName}"]`);
        if (statsWrap) {
            const progressBar = statsWrap.querySelector(".progress-bar");
            if (progressBar) {
                progressBar.value = progressValue;
                progressBar.max = progressMax;
            }
        }
    });
}

// Function to return the description text in English
function getEnglishDescriptionText(pokemonSpecies) {
	for (let entry of pokemonSpecies.flavor_text_entries) {
		if (entry.language.name === "en") {
			return entry.flavor_text;
		}
	}
}

// Function to navigate to the next or previous pokemon
async function loadOtherPokemon(id) {
	currentPokemonId = id;
	await loadPokemon(id);
}

// Function to create and append a new HTML element
function createAndAppendElement(parent, tag, options = {}) {
	const element = document.createElement(tag);
	Object.keys(options).forEach((key) => {
	  element[key] = options[key];
	});
	parent.appendChild(element);
	return element;
  }
  