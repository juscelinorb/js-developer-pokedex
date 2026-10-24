const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

// guarda os pokémons já carregados, usando o número como chave.
// Assim, ao clicar, não precisamos chamar a API de novo.
const pokemonsCache = {}

// Modal: elementos do modal (janelinha de detalhes)
const modal = document.getElementById('modal')
const modalContent = document.getElementById('modalContent')

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
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

// Montagem: HTML da tela de detalhes
function convertPokemonToDetail(pokemon) {
    return `
        <div class="modal-card ${pokemon.type}">
            <button class="modal-close" id="modalClose" type="button">&times;</button>
            <span class="number">#${pokemon.number}</span>
            <h2 class="name">${pokemon.name}</h2>

            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <img src="${pokemon.photo}" alt="${pokemon.name}">

            <div class="modal-info">
                <p><strong>Altura:</strong> ${pokemon.height} m</p>
                <p><strong>Peso:</strong> ${pokemon.weight} kg</p>
                <p><strong>Habilidades:</strong> ${pokemon.abilities.join(', ')}</p>

                <h3>Status base</h3>
                ${pokemon.stats.map((stat) => `
                    <div class="stat">
                        <span class="stat-name">${stat.name}</span>
                        <span class="stat-value">${stat.value}</span>
                        <div class="stat-bar"><div style="width: ${Math.min(stat.value, 100)}%"></div></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `
}

function openModal(pokemon) {
    modalContent.innerHTML = convertPokemonToDetail(pokemon)
    modal.classList.remove('hidden')
}

function closeModal() {
    modal.classList.add('hidden')
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        // Usa Cache: guarda cada pokémon no cache
        pokemons.forEach((pokemon) => {
            pokemonsCache[pokemon.number] = pokemon
        })

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

// Evento novo: clique em um pokémon da lista (event delegation)
pokemonList.addEventListener('click', (event) => {
    const li = event.target.closest('.pokemon')
    if (!li) return
    openModal(pokemonsCache[li.dataset.number])
})

// Evento novo: fechar o modal (botão X, clique no fundo escuro ou tecla Esc)
modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.id === 'modalClose') closeModal()
})
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal()
})
