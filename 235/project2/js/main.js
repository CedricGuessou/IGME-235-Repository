"using strict";

window.onload = (e) => {
    document.querySelector("#generate").onclick = generateButtonClicked;
    grabStoredData(type1, type1Key);
    grabStoredData(type2, type2Key);
}


let type1 = document.querySelector("#type1");
let type2 = document.querySelector("#type2");
let limit;
let pokemonList1; // Contains the unfiltered list of pokemon
let pokemonList2 = []; // Contains the url of the pokemon
let pokemonList3 = []; // Contains the list of pokemon
let pokemonList4 = []; // Contains the list of pokemon after sorting through types
let moveList = [];
let count = 0; // Everytime a pokemon is filtered by type count increases. When all the pokemon from list2
// have been filtered through then we can add them to the HTML

// Storage stuff
const prefix = "cdd8606";
const type1Key = prefix + "type1";
const type2Key = prefix + "type2";

type1.onchange = e => { localStorage.setItem(type1Key, e.target.value); };
type2.onchange = e => { localStorage.setItem(type2Key, e.target.value); };



const API_URL = "https://pokeapi.co/api/v2/";

// Generate button
function generateButtonClicked() {
    // Reset all the lists
    pokemonList1 = undefined;
    pokemonList2 = [];
    pokemonList3 = [];
    pokemonList4 = [];
    count = 0;

    // Get the types that were selected
    type1 = document.querySelector("#type1").value;
    type2 = document.querySelector("#type2").value;

    limit = document.querySelector("#limit").value;

    // Get a link to the section of the API about selected type1
    let url = API_URL + "type/";
    url += type1;

    // Load information from the section
    getType(url);

}

function getType(url) {
    // Create a new XHR object
    let xhr1 = new XMLHttpRequest();

    // Set the onload handler. Called when the data is successfully loaded
    xhr1.onload = typeLoaded;

    // Set the onerror handler. Called when error occurs
    xhr1.onerror = dataError;

    // Open connection and send the request
    xhr1.open("GET", url);
    xhr1.send();
}

function typeLoaded(e) {
    // event.target is the xhr object
    let xhr1 = e.target;

    // xhr.responseText is JSON file we just downloaded

    // Turned the text into a JavaScript object
    let obj = JSON.parse(xhr1.responseText);

    // Contains the general information of type1 like moves and pokemon etc.
    pokemonList1 = obj;

    // If there is no results, print an error and return
    if (pokemonList1.pokemon == undefined) {

        document.querySelector("#status").innerHTML = "<b>No results found for '" + type1 + type2 + "'</b>";

        return;
    }

    // Go through the first pokemon list and add the url to the Pokemon to
    // list two. All these pokemon are of type type1
    for (let i = 0; i < pokemonList1.pokemon.length; i++) {
        pokemonList2.push(pokemonList1.pokemon[i]);

    }

    // Call of the urls in list 2 so as to get the actual info of each pokemon
    for (let i = 0; i < pokemonList2.length; i++) {
        getPokemon(pokemonList2[i].pokemon.url);
    }

    // If there is no results, print an error and return
    if (!obj) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + type1 + "'</b>";
        return;
    }
}

function getPokemon(url) {
    // Create a new XHR object
    let xhr2 = new XMLHttpRequest();

    // Set the onload handler. Called when the data is successfully loaded
    xhr2.onload = pokemonLoaded;

    // Set the onerror handler. Called when error occurs
    xhr2.onerror = dataError;

    // Open connection and send the request
    xhr2.open("GET", url);
    xhr2.send();
}

function pokemonLoaded(e) {
    // event.target is the xhr object
    let xhr2 = e.target;

    // xhr.responseText is JSON file we just downloaded
    // console.log(xhr.responseText);

    // Turned the text into a JavaScript object
    let obj = JSON.parse(xhr2.responseText);

    obj.name = capitalizeFirstLetter(obj.name);

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
    else {
        pokemonList4.push(obj);
    }

    count++;

    if (count >= pokemonList2.length) {
        // Put the pokemon in order
        pokemonList4.sort(function (a, b) { return a.id - b.id })

        // Make a string to add the pokemon to the HTML
        let bigString = "";
        let limitCount = 0;

        // Go through ever pokemon in list4
        for (let i = 0; i < pokemonList4.length; i++) {

            if (limitCount >= limit) { break; }
            let sprite = pokemonList4[i].sprites.front_default; // The sprite of the specific pokemon

            // Build a div for each result
            let line = `<section class = 'pokemon'><p class = 'pokemon-name' 
                    num="${pokemonList4[i].id}">#${pokemonList4[i].id} ${pokemonList4[i].name}</p>
                    <img src = '${sprite}' title = '${pokemonList4[i].name}'>`;

            line += `<div class = 'moves'>`;

            // Adding moves----------------------------------
            // If the Pokemon has one move (e.g Ditto) add the singular move to the output
            if (pokemonList4[i].moves.length == 1) {
                let move = capitalizeFirstLetter(pokemonList4[i].moves[0].move.name);
                line += `<p>${move}`;

            }
            // If the Pokemon has no moves (i.e Gigantamax Pokemon) just put something there
            else if (pokemonList4[i].moves.length == 0) {
                line += `<p><b>Gigantamax moves!</b></p>`
            }
            // If the Pokemon has an actual move pool select 4 random moves
            else {
                for (let j = 0; j < 4; j++) {
                    let random = Math.floor(Math.random() * pokemonList4[i].moves.length);

                    let move = capitalizeFirstLetter(pokemonList4[i].moves[random].move.name);
                    line += `<p>${move}</p> `;
                }
            }

            line += `</div></section>`
            bigString += line;

            limitCount++;

        }

        document.querySelector("#results").innerHTML = bigString;

        // If there are no results display message
        if (pokemonList4.length <= 0) {
            document.querySelector("#results").innerHTML = "<b>No results found for '" + type1 + "' and '" + type2 + "'</b>";
            return;
        }
    }
}


function getMove(url) {
    // Create a new XHR object
    let xhr3 = new XMLHttpRequest();

    // Set the onload handler. Called when the data is successfully loaded
    xhr3.onload = moveLoaded;

    // Set the onerror handler. Called when error occurs
    xhr3.onerror = dataError;

    // Open connection and send the request
    xhr3.open("GET", url);
    xhr3.send();
}

function moveLoaded(e) {
    // event.target is the xhr object
    let xhr3 = e.target;

    // xhr.responseText is JSON file we just downloaded
    // console.log(xhr.responseText);

    // Turned the text into a JavaScript object
    let obj = JSON.parse(xhr3.responseText);

    moveList.push(obj);
}

function grabStoredData(nameField, nameKey) {
    // grab the stored data, will return `null` if the user has never been to this page
    const storedName = localStorage.getItem(nameKey);

    // if we find a previously set name value, display it
    if (storedName) {
        nameField.value = storedName;
    }
    else {
        nameField.value = "Type 1"; // a default value if `nameField` is not found
    }
}

function capitalizeFirstLetter(word) {
    // Access first letter using 0 index
    let letter = word[0].toUpperCase()

    // Update the string 
    word = letter + word.slice(1)

    return word;
}

function dataError(e) {
    console.log("An error occured");
}
