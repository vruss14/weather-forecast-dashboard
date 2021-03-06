let timeOfDay = moment().format("H");
let container = document.querySelector("#container");
let pageHeader = document.getElementById("header");

// Modify CSS classes based on time of day

if (timeOfDay > 9 && timeOfDay < 17) {
    container.setAttribute("class", "morning");
    pageHeader.textContent = "Today's Weather";
} else {
    container.setAttribute("class", "evening");
    pageHeader.textContent = "Tonight's Weather";
}

let city = document.querySelector("#city-name");
let temp = document.querySelector("#city-temp");
let humidity = document.querySelector("#city-humidity");
let wind = document.querySelector("#city-wind");
let uv = document.querySelector("#city-uv");
let searchForm = document.querySelector("#city-search-form");

// Running a search triggers the functions that fetch data from the API

function runSearch (event) {
    event.preventDefault();
    let userInput = document.querySelector("#search-value").value;

    if (!userInput) {
        return;
    } else {
        pullApiForecast (userInput);
        pull5DayForecast (userInput);
        saveSearch (userInput);
    }
}

searchForm.addEventListener("submit", runSearch);

// Saves each dynamically created button/search to the array

let searchBtnArray = JSON.parse(localStorage.getItem("searches"));
let searchWrapper = document.querySelector("#search-wrapper");
let searchList = document.querySelector("#search-list");

function saveSearch (userInput) {
        let searchBtn = document.createElement("button");
        searchBtn.textContent = userInput;
        searchBtn.setAttribute("class", "pastsearch");
        searchBtn.setAttribute("id", userInput);

        searchWrapper.append(searchBtn);

        if (searchBtnArray == null) {
            searchBtnArray = [userInput];
            localStorage.setItem("searches", JSON.stringify(searchBtnArray));
        } else {
            searchBtnArray.push(searchBtn.innerHTML);
            localStorage.setItem("searches", JSON.stringify(searchBtnArray));
        }
}

// Previous searches in local storage are displayed on page load

displayOldSearches();

function displayOldSearches () {
    let retrievedSearches = JSON.parse(localStorage.getItem("searches"));

    if (searchBtnArray != null) {
        for (let i=0; i < retrievedSearches.length; i++) {
            let search = retrievedSearches[i];
            let btn = document.createElement("button");
            btn.textContent = search;
            btn.setAttribute("class", "pastsearch");
            searchWrapper.append(btn);
        }
    }
}

// A clicked button runs a search again for that city's weather

let pastSearchBtns = $("#search-wrapper");
pastSearchBtns.on("click", ".pastsearch", repeatSearch);

function repeatSearch(event) {
    let btnClicked = $(event.target);
    userInput = btnClicked[0].innerHTML;
    document.querySelector("#search-value").value = btnClicked[0].innerHTML;
    runSearch(event);
}

// Function that fetches the current weather data (including the UV index) for a searched city
// Note: This is intended to be a front-end application only, and as such, it does not have a secure place to store the API key.

function pullApiForecast(userInput) {

    let requestCurrentForecast = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=e1347dac2254285ce9931aa3ec7dcb90" + "&units=imperial";

fetch(requestCurrentForecast)
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {

        city.textContent = " " + response.name + " (" + moment().format("MM/DD/YYYY") + ")";

        let currentIcon = document.createElement("img");
        currentIcon.setAttribute("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        currentIcon.setAttribute ("cookie", "SameSite=Lax");
        city.appendChild(currentIcon);

        temp.textContent = " " + response.main.temp + "°F";
        humidity.textContent = " " + response.main.humidity + "%";
        wind.textContent = " " + response.wind.speed + " MPH";

        let latitude = response.coord.lat;
        let longitude = response.coord.lon;

        let requestUvIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=e1347dac2254285ce9931aa3ec7dcb90";

        fetch(requestUvIndex)
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                uv.textContent = " " + response.value;

                let currentUVIndex = parseFloat(response.value);

                if (currentUVIndex < 2) {
                    uv.setAttribute("style", "background-color: green;");
                } else if (currentUVIndex < 7) {
                    uv.setAttribute("style", "background-color: yellow");
                } else {
                    uv.setAttribute("style", "background-color: red");
                }
            })
    })
}

// Displays 5 day forecast fetched results 

function pull5DayForecast(userInput) {
    let request5DayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&appid=e1347dac2254285ce9931aa3ec7dcb90" + "&units=imperial";

    fetch(request5DayForecast)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {

            //Display results for each day in the 5 day forecast

            response.list.filter((hour, i) => (i+12)%8 === 0).forEach((hour, i) => {
            const dayCount = i+1;
            let formatDay = moment.unix(parseInt(hour.dt)).format("MM/DD/YYYY");
            
            document.getElementById(`date${dayCount}`).textContent = (formatDay);

            document.getElementById(`weather${dayCount}`).textContent = hour.weather[0].main;

            document.getElementById(`weatherIcon${dayCount}`).setAttribute("src", "http://openweathermap.org/img/w/" + hour.weather[0].icon + ".png");
           
            document.getElementById(`temp${dayCount}`).textContent = "Temperature: " + hour.main.temp + "°F";

            document.getElementById(`humidity${dayCount}`).textContent = "Humidity: " + hour.main.humidity + "%";
        }) 
    })
}