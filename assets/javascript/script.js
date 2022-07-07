const searchCityButton = document.querySelector("#searchCityButton");

//This function will load the cities on page load, and also again when the search button is selected.
function renderHistoryButtons() {
	cityNameStored = JSON.parse(localStorage.getItem("cityName"));
	if (cityNameStored === null) {
		cityNameStored = [];
	}
	const cityHistory = document.querySelector("#cityHistory");
	cityHistory.innerHTML = "";
	cityNameStored.forEach((cityName, index) => {
		if (cityName != "") {
			const cityHistoryButton = document.createElement("button");
			cityHistoryButton.classList.add("cityHistoryButton");
			cityHistoryButton.innerHTML += `${cityName}`;
			cityHistory.append(cityHistoryButton);
		}
	});

	//click Handler on the cities in the user history to reload that cities weather.
	const historyButtons = document.querySelectorAll(".cityHistoryButton");

	for (let i = 0; i < historyButtons.length; i++) {
		const self = historyButtons[i];
		self.addEventListener("click", function (event) {
			const eventTarget = event.target.textContent;
			getRepoCity(eventTarget);
		});
	}
}

//click event on the submit button to store the user input city into the variable with local storage
searchCityButton.addEventListener("click", function (event) {
	event.preventDefault();
	const userInputCity = document.querySelector("#userInputCity");
	const cityName = userInputCity.value.trim();
	if (cityName) {
		getRepoCity(cityName);
		userInputCity.value = "";
	} else {
		alert("Please enter a city name");
	}
});

// This fetches the data from the Weather API
const getRepoCity = function (city) {
	const APIKey = "72975f24ac4c0c243b3f07fc0db630e0";
	const queryURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&appid=" +
		APIKey;
	fetch(queryURL).then(function (response) {
		if (response.ok) {
			response.json().then(function (cityName) {
				let cityNameStored;
				const cityLatLon = cityName.coord;
				const cityLat = cityLatLon.lat;
				const cityLon = cityLatLon.lon;
				cityName = cityName.name;
				cityNameStored = JSON.parse(localStorage.getItem("cityName"));
				if (cityNameStored === null) {
					cityNameStored = [];
				}

				if (!cityNameStored.includes(cityName)) {
					cityNameStored.push(cityName);
				}

				localStorage.setItem(
					"cityName",
					JSON.stringify(cityNameStored)
				);
				renderHistoryButtons();
				fetchWeather(cityName, cityLat, cityLon); //Create a function that will display the 5 day forecast in cards.
			});
		}
	});
};

//Function below does a second API call with the recieved Lat and Lon from the first call. This brings back all of the information required to display the daily forecast.
const cityNameEl = document.querySelector("#cityName");
const fetchWeather = (cityName, cityLat, cityLon) => {
	const todaysDate = moment().format("(DD/MM/YYYY)");
	cityNameEl.innerHTML = `${cityName} ${todaysDate}`;

	const APIKey = "72975f24ac4c0c243b3f07fc0db630e0";
	const queryURL =
		"http://api.openweathermap.org/data/2.5/onecall?lat=" +
		cityLat +
		"&lon=" +
		cityLon +
		"&units=metric&appid=" +
		APIKey;
	fetch(queryURL).then(function (response) {
		if (response.ok) {
			response.json().then(function (weather) {
				const cityTemp = weather.current.temp;
				const cityWind = weather.current.wind_speed;
				const cityHumidity = weather.current.humidity;
				const cityUVI = weather.current.uvi;
				const weatherIcon = weather.current.weather[0].main;
				displayWeather(
					cityTemp,
					cityWind,
					cityHumidity,
					cityUVI,
					weatherIcon
				);
			});
		}
	});
};

///WORKING HERE -> You just got the Temperature displaying on the daily forecast. Now if complete the rest of the requests on wind etc.

//This is called after the second API call and it renders the weather into the TodaysForecast section.
function displayWeather(
	cityTemp,
	cityWind,
	cityHumidity,
	cityUVI,
	weatherIcon
) {
	const todaysForecastTemp = document.querySelector("#todaysForecast");
	let dailyCityTemp = document.querySelector("#dailyCityTemp");
	let dailyCityWind = document.querySelector("#dailyCityWind");
	let dailyCityHumidity = document.querySelector("#dailyCityHumidity");
	let dailyCityUVI = document.querySelector("#dailyCityUVI");
	const todaysDate = moment().format("YYYY-MM-DD");
	cityNameEl.innerHTML += `${weatherIcon}`;
	dailyCityTemp.innerHTML = `Temp: ${cityTemp}°C`;
	dailyCityWind.innerHTML = `Wind: ${cityWind}km/h`;
	dailyCityHumidity.innerHTML = `Humidity: ${cityHumidity}%`;
	dailyCityUVI.innerHTML = `UV Index: ${cityUVI}`;
}

//On Page load these functions:
renderHistoryButtons();
