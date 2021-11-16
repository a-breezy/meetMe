var results = $("#result");
var favorite = [];
var tempObj;
let map;

function yelpAPI() {
    var location = document.querySelector("#locationInput").value;
    var apiURL =
        "https://uatapi.smartechc.com/api/test/yelpsearch?term=restaurants&radius=500&location=" +
        location +
        "&open_now=true&limit=50";
    $.ajax({
        type: "GET",
        url: apiURL,
        dataType: "json",
        success: function(data) {
            // Randomize the array Index
            var randomIndex = Math.floor(Math.random() * data.businesses.length);
            console.log(data);
            DisplayData(data.businesses[randomIndex]);
            tempObj = data.businesses[randomIndex];
            console.log(tempObj);
        },
    });
}

function saveLocalstorage() {
    localStorage.setItem("favorite", JSON.stringify(favorite));
}

function getStorage() {
    var storeItem = localStorage.getItem("favorite");
    storeItem = JSON.parse(storeItem);
    for (item in storeItem) {
        favorite.push(storeItem[item]);
    }
}

function DisplayData(data) {
    results.html("");
    var url, rating;
    initMap(data.coordinates.latitude, data.coordinates.longitude);
    url = data.url;
    rating = data.rating;
    var resultTileEl = document.createElement("article");
    resultTileEl.className = "box result-spot";
    var nameEl = document.createElement("a");
    nameEl.href = url;
    nameEl.target = "_blank";
    nameEl.textContent = data.name;
    nameEl.className = "subtitle";
    var addressEl = document.createElement("address");
    addressEl.innerHTML =
        data.location.address1 +
        " </br>" +
        data.location.city +
        ", " +
        data.location.state +
        " " +
        data.location.zip_code +
        " " +
        data.location.country +
        " </br>P:" +
        data.phone.replace('+', '');
    addressEl.className = "content pt-4";
    var categoryStr = "";
    var categoryEl = document.createElement("p");
    for (x in data.categories) {
        categoryStr += data.categories[x].title + "/";
    }
    categoryEl.textContent = "Category: " + categoryStr.slice(0, -1);
    categoryEl.className = "content";
    var moneyEl = document.createElement("p");
    moneyEl.className = "content";
    if (data.price === null || data.price === "" || data.price === undefined) {
        moneyEl.textContent = "Price: Not Available";
    } else {
        moneyEl.textContent = "Price: " + data.price;
    }
    var favoriteButtonEl = document.createElement("button");
    favoriteButtonEl.id = "favorite";
    favoriteButtonEl.className = "button is-warning is-outlined";
    favoriteButtonEl.innerHTML = "<spas class='far fa-star mr-2'></span>Save for later";
    results.append(resultTileEl);
    resultTileEl.append(nameEl, addressEl, categoryEl, moneyEl, favoriteButtonEl);
    
}

function initMap(lat, long) {
    var options = {
        center: {
            lat: lat,
            lng: long
        },
        zoom: 18
    }
    map = new google.maps.Map(document.getElementById("map"), options);
    $("#map").addClass("box");
    const marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: long
        },
        map: map
    })
}

function saveFavorite() {
    console.log("in this save FunctioN");
    favorite.push(tempObj);
    console.log(favorite);
    saveLocalstorage();
}

getStorage();
$("#search").on("click", yelpAPI);
$(document).on("click", "#favorite", saveFavorite);