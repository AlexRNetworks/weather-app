const locationDiv = document.getElementById('location');
const temperatureDiv = document.getElementById('temperature');
const conditionsDiv = document.getElementById('conditions');
const humidityDiv = document.getElementById('humidity');
const windDiv = document.getElementById('wind');
const forecastDiv = document.getElementById('forecast-items');
const loadingDiv = document.getElementById('loading');

const apiKey = '4abe940a306c4b281c2ebe31b3961caa'; // Your API Key

function getWeatherData(latitude, longitude) {
    loadingDiv.style.display = 'flex'; // Show loading indicator
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            displayForecast(data.forecast.forecastday);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            loadingDiv.style.display = 'none'; // Hide loading indicator
        });
}

function displayWeather(data) {
    locationDiv.textContent = `${data.location.name}, ${data.location.region}`;
    temperatureDiv.querySelector('span').textContent = `${data.current.temp_f}°F`;
    conditionsDiv.querySelector('span').textContent = data.current.condition.text;
    humidityDiv.querySelector('span').textContent = `${data.current.humidity}%`;
    windDiv.querySelector('span').textContent = `${data.current.wind_mph} mph`;
    loadingDiv.style.display = 'none';
}

function displayForecast(forecastData) {
    forecastDiv.innerHTML = ''; // Clear previous forecast
    forecastData.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.innerHTML = `
            <strong>${day.date}</strong><br>
            Temp: ${day.day.avgtemp_f}°F<br>
            ${day.day.condition.text}
        `;
        forecastDiv.appendChild(dayDiv);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeatherData(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

getLocation();
