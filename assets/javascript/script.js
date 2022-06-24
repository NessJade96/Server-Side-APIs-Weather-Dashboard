var APIKey = "72975f24ac4c0c243b3f07fc0db630e0";
var userInputCity = document.querySelector("#userInputCity");
var searchCityButton = document.querySelector("#searchCityButton");
var previouslySearchedCity = document.querySelector("#previouslySearchedCity");
var cityHistory = document.querySelector("#cityHistory");
var cityName;
var cityNameEl = document.querySelector("#cityName");
var cityHistoryButton = document.createElement("p");

//this creates the history buttons and saves the searched city to local storage -> WORK HERE! you need to make them pull from local storage not the user input. Needs to stay on refresh. <3
function storeCityLocalStorage(city) {
	localStorage.setItem("cityName", city);
	console.log(city.length);
	cityHistoryButton.innerHTML +=
		"<button id='styleCityHistoryButton'>" + city + "</button>";
	cityHistory.append(cityHistoryButton);
}

//click event on the submit button to store the user input city into the variable with local storage
searchCityButton.addEventListener("click", function (event) {
	event.preventDefault();
	cityName = userInputCity.value.trim();
	if (cityName) {
		getRepoCity(cityName);
		storeCityLocalStorage(cityName);
		userInputCity.value = "";
	} else {
		alert("Please enter a city name");
	}
});

// Function that will display the City name
var getCityName = function () {
	console.log(cityName);
	cityNameEl.innerHTML = cityName;

	// getCityIssues(cityName);
};
// else {
// 	document.location.replace("./index.html");
// }

var getRepoCity = function (city) {
	var queryURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&appid=" +
		APIKey;

	fetch(queryURL).then(function (response) {
		if (response.ok) {
			response.json().then(function (data) {
				console.log(data);
				getCityName();
				displayWeather(data); //Create a function that will display the 5 day forecast in cards.
			});
		} else {
			// document.location.replace("./index.html"); //This will reload the original home page if the input doesn't match a city
		}
	});
};

var displayWeather = function () {
	console.log("displayWeatherFunctionWorking"); //function that will display the 5 day forecast in cards. Only consol logs atm
};
