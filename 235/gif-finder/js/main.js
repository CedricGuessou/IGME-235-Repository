// 1
window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

// 2
let displayTerm = "";

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    // -----------------Creating a URL and updating the User Interface------------------------------------
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?"

    // Public API
    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7"

    // Build up our URL string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    // Parse the user entered term we wish to search
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // Get rid of any leading and trailing spaces
    term = term.trim();

    // Encode spaces and special characters
    term = encodeURIComponent(term);

    // If there's no term to search then bail out the function
    if (term.length < 1) return;

    // Append the search term to the URL (q is the parameter name)
    url += "&q=" + term;

    // Grab the user chosen search 'limit' from the <selector> and append it to the URL
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    // Update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    // See what the URL looks like
    console.log(url);

    // Request data!
    getData(url);
}

function getData(url) {
    // Create a new XHR object
    let xhr = new XMLHttpRequest();

    // Set the onload handler. Called when the data is successfully loaded
    xhr.onload = dataLoaded;

    // Set the onerror handler. Called when error occurs
    xhr.onerror = dataError;

    // Open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

// Callback Functions
function dataLoaded(e) {
    // event.target is the xhr object
    let xhr = e.target;

    // xhr.responseText is JSON file we just downloaded
    console.log(xhr.responseText);

    // Turned the text into a JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // If there is no results, print an error and return
    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }

    // Building an HTML string we will display to the user
    let results = obj.data;
    console.log("results.length =" + results.length);
    let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

    // Loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        console.log(results[i]);
        console.log(result.rating);

        // Get the URL to the GIF
        let smallURL = result.images.fixed_width_small.url;

        if (!smallURL) smallURL = "images/no-image-found.png";

        // Get the URL to the GIPHY Page
        let url = result.url;

        // Build a <div> to hold each result
        let line = `<div class = 'result'><p>Rating: ${result.rating.toUpperCase()}</p><img src = '${smallURL}' title = '${result.id}' />`;
        line += "<span><a target = '_blank' href = '${url}'>View on Giphy</a></span></div>";

        // Add the <div> to "bigString" and loop
        bigString += line;
    }

    // Build the HTML to show the user
    document.querySelector("#content").innerHTML = bigString;

    // Update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b>"
}

function dataError(e) {
    console.log("An error occured");
}

