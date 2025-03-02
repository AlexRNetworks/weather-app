const locationDiv = document.getElementById('location');
const temperatureDiv = document.getElementById('temperature');
const conditionsDiv = document.getElementById('conditions');
const humidityDiv = document.getElementById('humidity');
const windDiv = document.getElementById('wind');
const forecastDiv = document.getElementById('forecast-items');
const loadingDiv = document.getElementById('loading');

const apiKey = '4abe940a306c4b281c2ebe31b3961caa'; // Replace with your REAL API key

function getWeatherData(latitude, longitude) {
    loadingDiv.style.display = 'flex'; // Show loading indicator
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`; // Imperial units for Fahrenheit

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Add console log for debugging
            displayWeather(data.list[0]); // Display current weather from forecast
            displayForecast(data.list); // Display forecast
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            loadingDiv.style.display = 'none'; // Hide loading indicator
            locationDiv.textContent = "Error loading weather data.";
        });
}

function displayWeather(data) {
    if (data && data.city) {
        locationDiv.textContent = `${data.city.name}, ${data.city.country}`;
    } else if (data && data.list && data.list[0] && data.list[0].city) {
        locationDiv.textContent = `${data.list[0].city.name}, ${data.list[0].city.country}`;
    } else if (data && data.list && data.list[0] && data.list[0].name) {
        locationDiv.textContent = `${data.list[0].name}, ${data.list[0].sys.country}`;
    } else if (data && data.name) {
        locationDiv.textContent = `${data.name}, ${data.sys.country}`;
    } else {
        locationDiv.textContent = "Location not found.";
    }

    if (data && data.main && data.weather && data.weather[0]) {
        temperatureDiv.querySelector('span').textContent = `${data.main.temp}°F`;
        conditionsDiv.querySelector('span').textContent = data.weather[0].description;
        humidityDiv.querySelector('span').textContent = `${data.main.humidity}%`;
        windDiv.querySelector('span').textContent = `${data.wind.speed} mph`;
    } else if (data && data.list && data.list[0] && data.list[0].main && data.list[0].weather && data.list[0].weather[0]){
        temperatureDiv.querySelector('span').textContent = `${data.list[0].main.temp}°F`;
        conditionsDiv.querySelector('span').textContent = data.list[0].weather[0].description;
        humidityDiv.querySelector('span').textContent = `${data.list[0].main.humidity}%`;
        windDiv.querySelector('span').textContent = `${data.list[0].wind.speed} mph`;
    } else {
        temperatureDiv.querySelector('span').textContent = "Data not found";
        conditionsDiv.querySelector('span').textContent = "Data not found";
        humidityDiv.querySelector('span').textContent = "Data not found";
        windDiv.querySelector('span').textContent = "Data not found";
    }

    loadingDiv.style.display = 'none';
}

function displayForecast(forecastData) {
    forecastDiv.innerHTML = ''; // Clear previous forecast
    for(let i = 0; i < forecastData.length; i+=8){
        let day = forecastData[i];
        let date = new Date(day.dt * 1000); //convert unix timestamp to date.
        forecastDiv.innerHTML += `
            <div>
                <strong>${date.toDateString()}</strong><br>
                Temp: ${day.main.temp}°F<br>
                ${day.weather[0].description}
            </div>
        `;
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherData(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            locationDiv.textContent = "Error getting location.";
            loadingDiv.style.display = 'none';
        });
    } else {
        locationDiv.textContent = 'Geolocation is not supported by this browser.';
        loadingDiv.style.display = 'none';
    }
}

getLocation();
