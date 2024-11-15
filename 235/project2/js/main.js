// Set up the button to an onclick event
"using strict";

window.onload = (e) => { document.querySelector("#generate").onclick = generateButtonClicked }

let type1 = document.querySelector("p");
let type2 = document.querySelector("#type2");
let type3 = document.querySelector("h2");

/*document.querySelector("h1").innerHTML = "dasda";*/

const API_URL =  "https://pokeapi.co/api/v2/";

// Maybe save the type selected
let pokemon = createPokemon("bro", "fas", [1, 2, 3, 4]);
console.log(pokemon);
console.log(type1);
console.log(type2);
console.log(type3);


// Generate button
function generateButtonClicked() { }

// Pokemon class
function createPokemon(name, sprite, moves = [4]) {
    let pokemon = {
        name: name,
        sprite: sprite,
        moves: moves
    }

    return pokemon;
}