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

// https://openweathermap.org/forecast5 (5 day forecast)
// https://openweathermap.org/api/uvi (UV Index)
// https://openweathermap.org/current (Current weather)

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

function saveSearch (userInput) {
    let searchWrapper = document.querySelector("#search-wrapper");
    let searchBtn = document.createElement("button");
    searchBtn.textContent = userInput;
    searchBtn.setAttribute("style", "background-color: lightgray; text-align: center; margin-bottom: 5px;");
    searchBtn.setAttribute("class", "pastsearch");
    searchWrapper.append(searchBtn);
    //searchBtn.on("click", ".pastsearch", btnSearch); ERROR: searchBtn.on is not a function
}

// Need to use event delegation when a dynamically created button has been clicked so that the
// runSearch function runs again with the correct user input (which is the button's textcontent)

function btnSearch (event) {
    let btnClicked = $(event.target);
    let searchAgain = btnClicked.textContent;
    console.log(searchAgain);
    document.querySelector("#search-value").value = searchAgain;
    let userInput = searchAgain;

    console.log(searchAgain);
    console.log(userInput);

    pullApiForecast (userInput);
    pull5DayForecast (userInput);
}

// Function that fetches the current weather data (including the UV index) for a city; working normally

function pullApiForecast(userInput) {

    let requestCurrentForecast = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=e1347dac2254285ce9931aa3ec7dcb90" + "&units=imperial";

fetch(requestCurrentForecast)
    .then(function (response) {
        return response.json();
    })
    .then(function (response) {

        console.log(response);

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
                console.log(response);
                console.log(response.value);
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

// Displays 5 day forecast fetched results. Issue where the first fetch persists when searching again 
// Pictures need third-party cookie issues resolved

function pull5DayForecast(userInput) {
    let request5DayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&appid=e1347dac2254285ce9931aa3ec7dcb90" + "&units=imperial";

    fetch(request5DayForecast)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {

            //Displaying results for day 1 of the 5 day forecast

            let forecast1 = document.querySelector("#day1-forecast");

            let day1 = parseInt(response.list[6].dt);
            let formatDay1 = moment.unix(day1).format("MM/DD/YYYY");

            let date1 = document.createElement("p");
            date1.textContent = (formatDay1);
            forecast1.appendChild(date1);

            let weather1 = document.createElement("p");
            weather1.textContent = response.list[6].weather[0].main;
            forecast1.appendChild(weather1);

            let weatherIcon1 = document.createElement("img");
            weatherIcon1.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[6].weather[0].icon + ".png");
            weatherIcon1.setAttribute ("cookie", "SameSite=Strict");
            forecast1.appendChild(weatherIcon1);

            let temp1 = document.createElement("p");
            temp1.textContent = response.list[6].main.temp + "°F";
            forecast1.appendChild(temp1);

            let humidity1 = document.createElement("p");
            humidity1.textContent = response.list [6].main.humidity + "%";
            forecast1.appendChild(humidity1);


            //Displaying results for day 2 of the 5 day forecast

            let forecast2 = document.querySelector("#day2-forecast");
            
            let day2 = parseInt(response.list[14].dt);
            let formatDay2 = moment.unix(day2).format("MM/DD/YYYY");

            let date2 = document.createElement("p");
            date2.textContent = (formatDay2);
            forecast2.appendChild(date2);

            let weather2 = document.createElement("p");
            weather2.textContent = response.list[14].weather[0].main;
            forecast2.appendChild(weather2);

            let weatherIcon2 = document.createElement("img");
            weatherIcon2.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[14].weather[0].icon + ".png");
            weatherIcon2.setAttribute ("cookie", "SameSite=Strict");
            forecast2.appendChild(weatherIcon2);

            let temp2 = document.createElement("p");
            temp2.textContent = response.list[14].main.temp + "°F";
            forecast2.appendChild(temp2);

            let humidity2 = document.createElement("p");
            humidity2.textContent = response.list[14].main.humidity + "%";
            forecast2.appendChild(humidity2);


            //Displaying results for day 3 of the 5 day forecast

            let forecast3 = document.querySelector("#day3-forecast");

            let day3 = parseInt(response.list[22].dt);
            let formatDay3 = moment.unix(day3).format("MM/DD/YYYY");

            let date3 = document.createElement("p");
            date3.textContent = (formatDay3);
            forecast3.appendChild(date3);

            let weather3 = document.createElement("p");
            weather3.textContent = response.list[22].weather[0].main;
            forecast3.appendChild(weather3);

            let weatherIcon3 = document.createElement("img");
            weatherIcon3.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[22].weather[0].icon + ".png");
            weatherIcon3.setAttribute("cookie", "SameSite=Strict");
            forecast3.appendChild(weatherIcon3);

            let temp3 = document.createElement("p");
            temp3.textContent = response.list[22].main.temp + "°F";
            forecast3.appendChild(temp3);

            let humidity3 = document.createElement("p");
            humidity3.textContent = response.list[22].main.humidity + "%";
            forecast3.appendChild(humidity3);


            //Displaying results for day 4 of the 5 day forecast

            let forecast4 = document.querySelector("#day4-forecast");

            let day4 = parseInt(response.list[30].dt);
            let formatDay4 = moment.unix(day4).format("MM/DD/YYYY");

            let date4 = document.createElement("p");
            date4.textContent = (formatDay4);
            forecast4.appendChild(date4);

            let weather4 = document.createElement("p");
            weather4.textContent = response.list[30].weather[0].main;
            forecast4.appendChild(weather4);

            let weatherIcon4 = document.createElement("img");
            weatherIcon4.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[30].weather[0].icon + ".png");
            weatherIcon4.setAttribute ("cookie", "SameSite=Strict");
            forecast4.appendChild(weatherIcon4);

            let temp4 = document.createElement("p");
            temp4.textContent = response.list[30].main.temp + "°F";
            forecast4.appendChild(temp4);

            let humidity4 = document.createElement("p");
            humidity4.textContent = response.list[30].main.humidity + "%";
            forecast4.appendChild(humidity4);

            //Displaying results for day 5 of the 5 day forecast

            let forecast5 = document.querySelector("#day5-forecast");

            let day5 = parseInt(response.list[38].dt);
            let formatDay5 = moment.unix(day5).format("MM/DD/YYYY");

            let date5 = document.createElement("p");
            date5.textContent = (formatDay5);
            forecast5.appendChild(date5);

            let weather5 = document.createElement("p");
            weather5.textContent = response.list[38].weather[0].main;
            forecast5.appendChild(weather5);

            let weatherIcon5 = document.createElement("img");
            weatherIcon5.setAttribute("src", "http://openweathermap.org/img/w/" + response.list[38].weather[0].icon + ".png");
            weatherIcon5.setAttribute ("cookie", "SameSite=Strict");
            forecast5.appendChild(weatherIcon5);

            let temp5 = document.createElement("p");
            temp5.textContent = response.list[38].main.temp + "°F";
            forecast5.appendChild(temp5);

            let humidity5 = document.createElement("p");
            humidity5.textContent = response.list[38].main.humidity + "%";
            forecast5.appendChild(humidity5);
        })
}