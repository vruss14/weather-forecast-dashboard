let timeOfDay = moment().format("H");

// Modify CSS classes to morning tones, afternoon tones, and evening tones

let pageHeader = document.getElementById("header");

if (timeOfDay > 9 && timeOfDay < 12) {
    pageHeader.textContent = "Good morning!";
} else if (timeOfDay >= 12 && timeOfDay < 17) {
    pageHeader.textContent = "Good afternoon!";
} else if (timeOfDay >= 17) {
    pageHeader.textContent = "Good evening!";
}

let city = document.querySelector("#city-name");
let temp = document.querySelector("#city-temp");
let humidity = document.querySelector("#city-humidity");
let wind = document.querySelector("#city-wind");
let uv = document.querySelector("#city-uv");
let searchForm = document.querySelector("#city-search-form");

// The function that runs when someone submits a search

function runSearch (event) {
    event.preventDefault();
    let userInput = document.querySelector("#search-value").value;

    if (!userInput) {
        console.log("Error; need to enter a city to search");
    } else {
        console.log(userInput);
    }

    pullApiForecast (userInput);
    pull5DayForecast (userInput);
    saveSearch (userInput);
}

searchForm.addEventListener("submit", runSearch);

// Function that creates a button for each past search. These should be stored locally
// Clicking one of these buttons should run the search again for the textcontent (city)

let searchBtnArray = [];
let searchWrapper = document.querySelector("#search-wrapper");

function saveSearch (userInput) {
        let searchBtn = document.createElement("button");
        searchBtn.textContent = userInput;
        searchBtnArray.push(searchBtn.innerHTML);
        console.log(searchBtnArray);
        localStorage.setItem("searches", searchBtnArray);
}

displayOldSearches();

function displayOldSearches () {
    let retrievedSearches = localStorage.getItem("searches");
    console.log(retrievedSearches);

    //Console appears normal; buttons not displaying on page

    for (let i=0; i < searchBtnArray.length; i++) {
        let search = searchBtnArray[i];
        let btn = document.createElement("button");
        btn.textContent = search;
        btn.setAttribute("class", ".pastsearch");
        searchWrapper.append(btn);
    }
}

// Need to use event delegation when a dynamically created button has been clicked so that the
// runSearch function runs again with the correct user input (which is the button's textcontent)

function btnSearch (event) {
    let btnClicked = $(event.target);
    let searchAgain = btnClicked.textContent;
    document.querySelector("#search-value").value = searchAgain;
    let userInput = searchAgain;

    pullApiForecast (userInput);
    pull5DayForecast (userInput);
}

// Function that fetches the current weather data (including the UV index) for a city

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

            //Displaying results for day 1 of the 5 day forecast

            let day1 = parseInt(response.list[6].dt);
            let formatDay1 = moment.unix(day1).format("MM/DD/YYYY");

            let date1 = document.getElementById("date1");
            date1.textContent = (formatDay1);

            let weather1 = document.getElementById("weather1");
            weather1.textContent = response.list[6].weather[0].main;

            let weatherIcon1 = document.getElementById("weatherIcon1");
            weatherIcon1.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[6].weather[0].icon + ".png");
            weatherIcon1.setAttribute ("cookie", "SameSite=Strict");

            let temp1 = document.getElementById("temp1");
            temp1.textContent = response.list[6].main.temp + "°F";

            let humidity1 = document.getElementById("humidity1");
            humidity1.textContent = response.list [6].main.humidity + "%";

            //Displaying results for day 2 of the 5 day forecast
            
            let day2 = parseInt(response.list[14].dt);
            let formatDay2 = moment.unix(day2).format("MM/DD/YYYY");

            let date2 = document.getElementById("date2");
            date2.textContent = (formatDay2);

            let weather2 = document.getElementById("weather2");
            weather2.textContent = response.list[14].weather[0].main;

            let weatherIcon2 = document.getElementById("weatherIcon2");
            weatherIcon2.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[14].weather[0].icon + ".png");

            let temp2 = document.getElementById("temp2")
            temp2.textContent = response.list[14].main.temp + "°F";

            let humidity2 = document.getElementById("humidity2");
            humidity2.textContent = response.list[14].main.humidity + "%";

            //Displaying results for day 3 of the 5 day forecast

            let day3 = parseInt(response.list[22].dt);
            let formatDay3 = moment.unix(day3).format("MM/DD/YYYY");

            let date3 = document.getElementById("date3");
            date3.textContent = (formatDay3);

            let weather3 = document.getElementById("weather3");
            weather3.textContent = response.list[22].weather[0].main;

            let weatherIcon3 = document.getElementById("weatherIcon3")
            weatherIcon3.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[22].weather[0].icon + ".png");

            let temp3 = document.getElementById("temp3");
            temp3.textContent = response.list[22].main.temp + "°F";

            let humidity3 = document.getElementById("humidity3");
            humidity3.textContent = response.list[22].main.humidity + "%";

            //Displaying results for day 4 of the 5 day forecast

            let day4 = parseInt(response.list[30].dt);
            let formatDay4 = moment.unix(day4).format("MM/DD/YYYY");

            let date4 = document.getElementById("date4");
            date4.textContent = (formatDay4);

            let weather4 = document.getElementById("weather4");
            weather4.textContent = response.list[30].weather[0].main;

            let weatherIcon4 = document.getElementById("weatherIcon4");
            weatherIcon4.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[30].weather[0].icon + ".png");

            let temp4 = document.getElementById("temp4");
            temp4.textContent = response.list[30].main.temp + "°F";

            let humidity4 = document.getElementById("humidity4")
            humidity4.textContent = response.list[30].main.humidity + "%";

            //Displaying results for day 5 of the 5 day forecast

            let day5 = parseInt(response.list[38].dt);
            let formatDay5 = moment.unix(day5).format("MM/DD/YYYY");

            let date5 = document.getElementById("date5");
            date5.textContent = (formatDay5);

            let weather5 = document.getElementById("weather5");
            weather5.textContent = response.list[38].weather[0].main;

            let weatherIcon5 = document.getElementById("weatherIcon5");
            weatherIcon5.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[38].weather[0].icon + ".png");

            let temp5 = document.getElementById("temp5");
            temp5.textContent = response.list[38].main.temp + "°F";

            let humidity5 = document.getElementById("humidity5");
            humidity5.textContent = response.list[38].main.humidity + "%";
        })
}