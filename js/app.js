const privateKey = 'aa91c7aa3e94e8907f9ff2edabdf5130ce74e5b5';
const publicKey = 'cb31a1ac45ec773e9fd15bbed93c3c95';
const content = document.getElementById('content');
const search = document.getElementById('search');
let characters = [];

const fetchCharacters = async () => {
    try {
        const ts = Date.now();
        const hash = md5(ts + privateKey + publicKey);
        const URL = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        const response = await fetch(URL);
        const { data: { results : characters } } = await response.json();
        return characters;
    }
    catch(err) {
        console.error(err);
    }
}

const createNode = ({ id, name, description, thumbnail }) => {
    const imageSrc = `${thumbnail.path}/portrait_uncanny.${thumbnail.extension}`
    console.log(id);
    const node = `
        <div class="col-md-4 col-12" id=${id}>
            <div class="card mt-5 ml-3">
                <img src="${imageSrc}" />
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Description: ${description}</p>
                    <button onclick=del(${id}) class="btn btn-danger btn-block">Delete</button>
                </div>
            </div>
        </div>
    `;
    content.insertAdjacentHTML("beforeend", node);
}

const searchCharacter = async () => {
    clearDom();
    try {
        const ts = Date.now();
        const hash = md5(ts + privateKey + publicKey);
        const name = search.value.trim();
        const hero = encodeURIComponent(name);
        const URL = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${hero}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        const response = await fetch(URL);
        console.log(response)
        const { data: { results : characters } } = await response.json();
        console.log(characters);
        
        iterateCharacters(characters);
    }
    catch(err) {
        console.error(err);
    }    
};

const iterateCharacters = (characters) => {
    characters.map(character => {
        createNode(character);
    })
};

const showMessage = () => {
    document.getElementById('message').innerHTML = "No characters to show.";
    document.querySelector('#input').disabled = true;
};

const del = (id) => {
    document.getElementById(id).remove();
    characters = characters.filter(character => character.id != id);
    characters.length === 0 ? showMessage() : null;
};

const clearDom = () => {
    characters = [];
    content.innerHTML = '';
    const elem = `
    <p id="message">
    </p>
    `;
    content.insertAdjacentHTML("beforeend", elem);
}

async function start() {
    document.getElementById('find').addEventListener("click", searchCharacter);
    characters = await fetchCharacters();
    iterateCharacters(characters);
};

window.onload = start();