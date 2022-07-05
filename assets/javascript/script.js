var cityNameEl = document.querySelector("#cityName");
var searchCityButton = document.querySelector("#searchCityButton");

//click event on the submit button to store the user input city into the variable with local storage
searchCityButton.addEventListener("click", function (event) {
	event.preventDefault();
	var userInputCity = document.querySelector("#userInputCity");
	var cityName = userInputCity.value.trim();
	if (cityName) {
		getRepoCity(cityName);
		userInputCity.value = "";
	} else {
		alert("Please enter a city name");
	}
});

var getRepoCity = function (city) {
	var APIKey = "72975f24ac4c0c243b3f07fc0db630e0";
	var queryURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&appid=" +
		APIKey;

	fetch(queryURL).then(function (response) {
		if (response.ok) {
			response.json().then(function (cityName) {
				console.log(cityName.name);
				var cityNameStored;
				cityName = cityName.name;
				if (cityNameStored === null) {
					cityNameStored = [];
					console.log("im empty");
				}
				cityNameStored = JSON.parse(localStorage.getItem("cityName"));
				console.log(cityNameStored);
				cityNameStored.push(cityName);
				cityNameStored = cityNameStored.filter(function (i) {
					if (!this[i]) {
						this[i] = 1;
						return i;
					}
				}, {});
				localStorage.setItem(
					"cityName",
					JSON.stringify(cityNameStored)
				);
				console.log(cityNameStored);
				var cityHistory = document.querySelector("#cityHistory");
				cityHistory.innerHTML = "";
				cityNameStored.forEach((cityName, index) => {
					if (cityName != "") {
						cityNameEl.innerHTML = cityName;
						var cityHistoryButton = document.createElement("p");
						cityHistoryButton.innerHTML +=
							"<button class='cityHistoryButton' id='styleCityHistoryButton'>" +
							cityNameEl.textContent +
							"</button>";
						cityHistory.append(cityHistoryButton);
					}
				});
				displayWeather(cityName); //Create a function that will display the 5 day forecast in cards.
			});
		} else {
			// document.location.replace("./index.html"); //This will reload the original home page if the input doesn't match a city
		}
	});
};

var displayWeather = function (cityName) {
	console.log(cityName);
	console.log("displayWeatherFunctionWorking"); //function that will display the 5 day forecast in cards. Only consol logs atm
};
