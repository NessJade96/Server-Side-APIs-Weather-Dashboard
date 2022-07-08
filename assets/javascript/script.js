//This function will load the cities on page load, and also again when the search button is selected.
function renderHistoryButtons() {
	cityNameStored = JSON.parse(localStorage.getItem("cityName"));
	if (cityNameStored === null) {
		cityNameStored = [];
	}
	const cityHistory = document.querySelector("#cityHistory");
	cityHistory.innerHTML = "";
	cityNameStored.forEach((cityName) => {
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
const searchCityButton = document.querySelector("#searchCityButton");

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
		"https://api.openweathermap.org/data/2.5/weather?q=" +
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
				fetchWeather(cityName, cityLat, cityLon);
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
				const weatherResponse = weather;

				//the data is then input into these functions:
				renderDailyWeatherIcon(weatherIcon);
				displayDailyWeather(cityTemp, cityWind, cityHumidity, cityUVI);
				renderUVIColor(cityUVI);
				displayFiveDayForecast(weatherResponse);
			});
		}
	});
};

//This will loop through each of the 5 days to render the weather.
function displayFiveDayForecast(weatherResponse) {
	const fivedayforecast = document.querySelectorAll(".fivedayforecast");
	for (let i = 0; i < fivedayforecast.length; i++) {
		const fetchDate = moment().add(i + 1, "days");
		const renderDate = fetchDate.format("DD-MM-YYYY");
		fivedayforecast[i].classList.add("boxFiveDay", "bold");
		fivedayforecast[i].innerHTML = `${renderDate}`;

		//this renders the weather icon
		const fiveDayWeatherIcon = weatherResponse.daily[i].weather[0].main;
		const FDweatherIcon = document.querySelector(".FDweatherIcon");
		const textFDWeatherIcon = document.createElement("p");
		textFDWeatherIcon.classList.add("fDWeatherDetails", "FDweatherIcon");

		//This if statement shows the weather icons: Clouds, Clear, etc.
		if (fiveDayWeatherIcon === "Clouds") {
			textFDWeatherIcon.innerHTML += "<i class='fa-solid fa-cloud'></i>";
		} else if (fiveDayWeatherIcon === "Clear") {
			textFDWeatherIcon.innerHTML += "<i class='fa-regular fa-sun'></i>";
		} else if (fiveDayWeatherIcon === "Rain") {
			textFDWeatherIcon.innerHTML +=
				"<i class='fa-solid fa-cloud-rain'></i>";
		} else if (fiveDayWeatherIcon === "Storming") {
			textFDWeatherIcon.innerHTML +=
				"<i class='fa-regular fa-cloud-bolt'></i>";
		}
		fivedayforecast[i].append(textFDWeatherIcon);

		//renders the Temp
		const fiveDayTemp = weatherResponse.daily[i].temp.day;
		const renderFDTemp = document.createElement("p");
		renderFDTemp.classList.add("fDWeatherDetails");
		renderFDTemp.innerHTML += `Temp: ${fiveDayTemp}°C`;
		fivedayforecast[i].append(renderFDTemp);

		//renders the Wind
		const fiveDayWind = weatherResponse.daily[i].wind_speed;
		const renderFDWind = document.createElement("p");
		renderFDWind.classList.add("fDWeatherDetails");
		renderFDWind.innerHTML += `Wind: ${fiveDayWind}km/h`;
		fivedayforecast[i].append(renderFDWind);

		//renders the Humidity
		const fiveDayHumidity = weatherResponse.daily[i].humidity;
		const renderFDHumidity = document.createElement("p");
		renderFDHumidity.classList.add("fDWeatherDetails");
		renderFDHumidity.innerHTML += `Humidity: ${fiveDayHumidity}%`;
		fivedayforecast[i].append(renderFDHumidity);
	}
}

//This function shows the weather icons: Clouds, Clear, etc. for the daily weather
function renderDailyWeatherIcon(weatherIcon) {
	if (weatherIcon === "Clouds") {
		cityNameEl.innerHTML += "<i class='fa-solid fa-cloud'></i>";
	} else if (weatherIcon === "Clear") {
		cityNameEl.innerHTML += "<i class='fa-regular fa-sun'></i>";
	} else if (weatherIcon === "Rain") {
		cityNameEl.innerHTML += "<i class='fa-solid fa-cloud-rain'></i>";
	} else if (weatherIcon === "Storming") {
		cityNameEl.innerHTML += "<i class='fa-regular fa-cloud-bolt'></i>";
	}
}

//This will show the UV levels
function renderUVIColor(cityUVI) {
	const UVIndex = document.getElementById("UVIndex");
	if (cityUVI < 5) {
		UVIndex.classList.add("UVImoderate");
	} else if (cityUVI < 7) {
		UVIndex.classList.add("UVIHigh");
	} else if (cityUVI < 10) {
		UVIndex.classList.add("UVIVeryHigh");
	}
}

//This is called after the second API call and it renders the weather into the TodaysForecast section.
function displayDailyWeather(cityTemp, cityWind, cityHumidity, cityUVI) {
	const todaysForecastTemp = document.querySelector("#todaysForecast");
	let dailyCityTemp = document.querySelector("#dailyCityTemp");
	let dailyCityWind = document.querySelector("#dailyCityWind");
	let dailyCityHumidity = document.querySelector("#dailyCityHumidity");
	let dailyCityUVI = document.querySelector("#dailyCityUVI");
	const todaysDate = moment().format("YYYY-MM-DD ");
	dailyCityTemp.innerHTML = `Temp: ${cityTemp}°C`;
	dailyCityWind.innerHTML = `Wind: ${cityWind}km/h`;
	dailyCityHumidity.innerHTML = `Humidity: ${cityHumidity}%`;
	dailyCityUVI.innerHTML = `UV Index: <p id='UVIndex'> ${cityUVI} </p>`;
}

//On Page load these functions:
renderHistoryButtons();
