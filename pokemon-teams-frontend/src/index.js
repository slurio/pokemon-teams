document.addEventListener('DOMContentLoaded', () => {

    const BASE_URL = "http://localhost:3000"
    const TRAINERS_URL = `${BASE_URL}/trainers`
    const POKEMONS_URL = `${BASE_URL}/pokemons/`


    const fetchTrainers = (url) => {
        
        fetch(url)
        .then(response => response.json())
        .then(trainers => renderTrainers(trainers))
    }

    const renderTrainers = (data) => {
        
        for(let trainer of data){
            
            trainerInfo = {
                name: trainer.name,
                trainerId: trainer.id,
                pokemons: trainer.pokemons
            }
        renderTrainer(trainerInfo)
        }
    }

    const renderTrainer = (info) => {

        const trainerDiv = document.createElement('div')
        trainerDiv.textContent = info.name
        
        trainerDiv.dataset.id = `${info.trainerId}`
        trainerDiv.classList.add('card')
        const button = document.createElement('button')
        button.classList.add('add')
        button.textContent = "Add Pokemon"
        button.dataset.id = `${info.trainerId}`

        const ul = document.createElement('ul')
        trainerDiv.append(ul)
        trainerDiv.append(button)
        const mainTag = document.querySelector('main')
        mainTag.append(trainerDiv)

        renderPokemons(trainerDiv, info.pokemons)
    }

    const renderPokemons = (div, data) => {
        
        for(let pokemon of data){
            const li = document.createElement('li')
            li.insertAdjacentHTML('beforeend', `
            ${pokemon.nickname} (${pokemon.species})
            <button class="release" data-pokemonId="${pokemon.id}">Release</button>
            `)
          
            const ul = div.querySelector('ul')
            ul.append(li)
        }

    }

    const clickHandler = () => {
        document.addEventListener('click', e => {
            if(e.target.matches('.add')){
                addPokemon(e.target)
            }else if(e.target.matches('.release')){
                const pokemonId = e.target.dataset.pokemonid
                deletePokemon(e.target, pokemonId)
            }
        })
    }

    const deletePokemon = (target, id) => {

       const options = {
            method: "DELETE"
        }

        fetch(POKEMONS_URL + id, options)
        .then(response => response.json())
        .then(deletePokemon => {
            const li = target.parentElement
            li.remove()
        })
    }

    const addPokemon = (target) => {
        const div = target.parentElement
        const id = div.dataset.id
        const liArray = div.querySelectorAll('li')
        const count = liArray.length
        
        if(count < 6){
            options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trainer_id: `${id}`
                })
            }
    
            fetch(POKEMONS_URL, options)
            .then(response => response.json())
            .then(pokemon => renderPokemon(pokemon, div))
        }
        

    }

    const renderPokemon = (pokemon, div) => {
        
        const li = document.createElement('li')
        li.insertAdjacentHTML('beforeend', `
        ${pokemon.nickname} (${pokemon.species})
        <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
        `)
        
        const ul = div.querySelector('ul')
        ul.append(li)

    }
   

    fetchTrainers(TRAINERS_URL)
    clickHandler()


})