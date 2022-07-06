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
			cityHistoryButton.innerHTML += cityName;
			cityHistory.append(cityHistoryButton);
		}
	});

	//click Handler on the cities in the user history to reload that cities weather.
	const historyButtons = document.querySelectorAll(".cityHistoryButton");

	for (let i = 0; i < historyButtons.length; i++) {
		const self = historyButtons[i];
		self.addEventListener("click", function (event) {
			const eventTarget = event.target.textContent;
			console.log(eventTarget);
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

const getRepoCity = function (city) {
	console.log("🚀 ~ file: script.js ~ line 38 ~ getRepoCity ~ city", city);
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
				displayWeather(cityName); //Create a function that will display the 5 day forecast in cards.
			});
		} else {
			// document.location.replace("./index.html"); //This will reload the original home page if the input doesn't match a city
		}
	});
};

const displayWeather = (cityName) => {
	const cityNameEl = document.querySelector("#cityName");
	console.log(cityName);
	console.log("displayWeatherFunctionWorking"); //function that will display the 5 day forecast in cards. Only consol logs atm
	cityNameEl.innerHTML = cityName;
};

// function emptyWeather() {
// 	cityNameEl.textContent = "CITY";
// }

//On Page load these functions:
renderHistoryButtons();

// emptyWeather();
