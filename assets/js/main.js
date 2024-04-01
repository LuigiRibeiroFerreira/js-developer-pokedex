const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 12
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id=${pokemon.number} onclick="openOverlay()">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        // Adicionando event listener para os elementos <li>
        const pokemonItems = document.querySelectorAll('.pokemon');
        pokemonItems.forEach(pokemonItem => {
            pokemonItem.addEventListener('click', () => {
                const pokemonId = pokemonItem.dataset.id;
                pokeApi.getPokemonDetailById(pokemonId).then(pokemonDetail => {
                    showPokemonModal(pokemonDetail);
                });
            });
        });
    });
}
function calcularCor(valor) {
    // Mapeia o valor entre 0 e 100 para uma cor entre vermelho (0) e verde (100)
    const cor = `rgb(${255 - valor * 2.55}, ${valor * 2.55}, 0)`;
    return cor;
}
function showPokemonModal(pokemon) {
    const modalHtml = `
    <div id="pokemonModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 class="pokemon-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <div class="pokemon-info">
                <img class="pokemon-image" src="${pokemon.photo}" alt="${pokemon.name}" >
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <div class="measures">
                    <p>Height: ${pokemon.height}</p>
                    <p>Weight: ${pokemon.weight}</p>
                </div>
                <div class="base-stats">
                ${pokemon.baseStat.map(stat => `
                    <div class="stat-item">
                    <div class="stat-bar" style="--stat-height: ${stat.base_stat / 160 * 100}%; --stat-color: ${calcularCor(stat.base_stat / 160 * 100)};"></div>
                        <p class="stat-value">${stat.base_stat}</p>
                        <p class="stat-name">${stat.stat.name}</p>
                    </div>
                `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('pokemonModal');
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    console.log(pokemon)
}


pokeApi.getPokemonDetailById = (pokemonId) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    return fetch(url)
        .then(response => response.json())
        .then(convertPokeApiDetailToPokemon);
};

