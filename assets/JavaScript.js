// Select search button and add event listener for initial search
var searchBtn = document.querySelector("#submit");

searchBtn.addEventListener("click", searchCityInitial);
// Select city weather container and remove "hide" class when initial search button is clicked
var cityWeatherContainer = document.querySelector(".city-weather-container");
searchBtn.addEventListener("click", function () {
  cityWeatherContainer.classList.remove("hide");
});
// Function for initial search that gets the input value and passes it to the search city function
function searchCityInitial() {
  var searchInput = document.querySelector("#search").value;
  searchCity(searchInput, true);
}
// Function that fetches weather data for the input city and updates the 5-day forecast cards
function searchCity(input, allowNewButton = false) {
  var apiKey = "f6c7f5ccbc9e5beee322bc9c0e6e59ce";
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${input}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Update 5-day forecast cards
      var forecastCards = document.querySelectorAll(".forecast-card");
      for (var i = 0; i < forecastCards.length; i++) {
        // Get data for specific time (noon on the i-th day)
        var forecastData = data.list[i * 8 + 4];
        forecastCards[i].querySelector(".date").innerHTML =
          "Date: " + dayjs(forecastData.dt * 1000).format("MMMM D, YYYY");
        forecastCards[i].querySelector(".weather-icon").src =
          "https://openweathermap.org/img/w/" +
          forecastData.weather[0].icon +
          ".png";
        forecastCards[i].querySelector(".temperature").innerHTML =
          "Temperature: " +
          (((forecastData.main.temp - 273.15) * 9) / 5 + 32).toFixed(1) +
          " °F";
        forecastCards[i].querySelector(".humidity").innerHTML =
          "Humidity: " + forecastData.main.humidity + "%";
        forecastCards[i].querySelector(".wind-speed").innerHTML =
          "Wind Speed: " + forecastData.wind.speed + " m/s";
      }

      // Update HTML for current city's weather
      updateWeather(data);
      if (allowNewButton) {
        // If allowNewButton is true, add searched city to the history
        var previousContainer = document.querySelector(".previous-container");
        var newButton = document.createElement("button");
        newButton.classList.add("previous");
        newButton.innerText = data.city.name;
        newButton.addEventListener("click", function () {
          searchCity(data.city.name, false);
        });
        previousContainer.appendChild(newButton);
      }
    });
}
// Helper function that updates the HTML for the current city's weather
function updateWeather(data) {
  var currentData = data.list[0];
  document.querySelector("#city-name").innerHTML = data.city.name;

  document.querySelector("#date").innerHTML =
    "Date: " + dayjs(currentData.dt * 1000).format("MMMM D, YYYY h:mm A");
  document.querySelector("#weather-icon").src =
    "https://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png";
  document.querySelector("#temperature").innerHTML =
    "Temperature: " +
    (((currentData.main.temp - 273.15) * 9) / 5 + 32).toFixed(1) +
    " °F";
  document.querySelector("#humidity").innerHTML =
    "Humidity: " + currentData.main.humidity + "%";
  document.querySelector("#wind-speed").innerHTML =
    "Wind Speed: " + currentData.wind.speed + " m/s";
}
