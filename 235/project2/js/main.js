"using strict";

window.onload = (e) => {
    document.querySelector("#generate").onclick = generateButtonClicked

    // Get the types that were selected
    type1 = document.querySelector("#type1").value;
    type2 = document.querySelector("#type2").value;
}

let type1;
let type2;
let pokemonList1; // Contains the unfiltered list of pokemon
let pokemonList2 = []; // Contains the url of the pokemon
let pokemonList3 = []; // Contains the list of pokemon
let pokemonList4 = []; // Contains the list of pokemon after sorting through types

const API_URL = "https://pokeapi.co/api/v2/";

// Maybe save the type selected



// Generate button
function generateButtonClicked() {
    // Reset all the lists
    pokemonList1 = undefined;
    pokemonList2 = [];
    pokemonList3 = [];
    pokemonList4 = [];

    

    // Get a link to the section of the API about selected type1
    let url = API_URL + "type/";
    url += type1;

    // Load information from the section
    getType(url);

}

function getType(url) {
    // Create a new XHR object
    let xhr = new XMLHttpRequest();

    // Set the onload handler. Called when the data is successfully loaded
    xhr.onload = typeLoaded;

    // Set the onerror handler. Called when error occurs
    xhr.onerror = dataError;

    // Open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function typeLoaded(e) {
    // event.target is the xhr object
    let xhr = e.target;

    // xhr.responseText is JSON file we just downloaded
    // console.log(xhr.responseText);

    // Turned the text into a JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // Contains the general information of type1 like moves and pokemon etc.
    pokemonList1 = obj;

    // Go through the first pokemon list and add the url to the Pokemon to
    // list two. All these pokemon are of type type1
    for (let i = 0; i < pokemonList1.pokemon.length; i++) {
        pokemonList2.push(pokemonList1.pokemon[i]);

    }

    // Call of the urls in list 2 so as to get the actual info of each pokemon
    for (let i = 1; i < pokemonList2.length; i++) {
        getPokemon(pokemonList2[i].pokemon.url);
    }


    // If there is no results, print an error and return
    if (!obj) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + type1 + "'</b>";
        return;
    }

    // Use the pokemon property to make a list of pokemon gotten from the 
    // pokemon

    // - Make sure to check whether the Pokemon also contains type2. If yes,
    // add it a ?list?


    // - Once we have all the pokemon that fulfil the type requirement, make pokemon
    // objects using their names and sprites
    // - Have to write algorithm to pick the most optimal moves, but for now just put
    // the first 4 moves in the list
    // - To finish up, use all the pokemon objects to make boxes that will be displayed
    // on the website

}

function getPokemon(url) {
    // Create a new XHR object
    let xhr = new XMLHttpRequest();

    // Set the onload handler. Called when the data is successfully loaded
    xhr.onload = pokemonLoaded;

    // Set the onerror handler. Called when error occurs
    xhr.onerror = dataError;

    // Open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function pokemonLoaded(e) {
    // event.target is the xhr object
    let xhr = e.target;

    // xhr.responseText is JSON file we just downloaded
    // console.log(xhr.responseText);

    // Turned the text into a JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // Add information of the pokemon to list3
    pokemonList3.push(obj);

    // Run only if a second type was selected
    if (type2 != "") {

        // Go through all its types. If one of them is type2, add the pokemon to list 4
        for (let i = 0; i < obj.types.length; i++) {
            if (obj.types[i].type.name == type2) {
                pokemonList4.push(obj);
            }
        }
    }

    // Make a string to add the pokemon to the HTML
    let bigString = "";

    // Go through ever pokemon in list4
    for (let i = 0; i < pokemonList4.length; i++) {
        let sprite = pokemonList4[i].sprites.front_default; // The sprite of the specific pokemon

        // Build a div for each result
        let line = `<section class = 'pokemon'><p>${pokemonList4[i].name}</p>
                <img src = '${sprite}' title = '${pokemonList4[i].name}'>`;

        line += `<div class = 'moves'>`;

        // Add the first 4 moves to the HTML
        // CHANGE LATER TO INCLUDE ACTUAL CALCULATIONS FOR MOST OPTIMAL MOVES
        for (let j = 0; j < 4; j++) {
            line += `<p>${pokemonList4[i].moves[j].move.name}</p> `;
        }

        line += `</div></section>`

        bigString += line;
    }

    document.querySelector("#results").innerHTML = bigString;
}

function dataError(e) {
    console.log("An error occured");
}

// Pokemon class (Not being used yet)
function createPokemon(name, sprite, moves = [4]) {
    let pokemon = {
        name: name,
        sprite: sprite,
        moves: moves
    }

    return pokemon;
}

// Check if the Pokemon is of both types  (Not being used yet)
function CheckTyping(pokemon) {
    for (let i = 0; i < 2; i++) {
        if (pokemon.types[i].type.name == type2) {
            return true;
        }
        else {
            return false;
        }
    }
}

// Not being used yet
function CheckPokemon() {
    for (let i = 0; i < pokemonList3.length; i++) {
        for (let j = 0; i < pokemonList3[i].types.length; i++) {
            if (pokemonList3[i].types[j].type.name == type2) {
                pokemonList4.push(pokemonList3[i])
            }
        }
    }
}

