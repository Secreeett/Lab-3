document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "ZTRW6puxXmCwxwACjUnFNoVfBMP5zmlw"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const forecastDiv = document.getElementById("forecast");
    const fiveDayForecastDiv = document.getElementById("5day-forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
        getForecast(city);
        getFiveDayForecast(city);
    });

    function getWeather(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found.');
                }
                return response.json();
            })
            .then(data => {
                const locationKey = data[0].Key;
                return fetchWeatherData(locationKey);
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function getForecast(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found.');
                }
                return response.json();
            })
            .then(data => {
                const locationKey = data[0].Key;
                return fetchForecastData(locationKey);
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                forecastDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }

    function fetchForecastData(locationKey) {
        const url = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayForecast(data);
                } else {
                    forecastDiv.innerHTML = `<p>No forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
                forecastDiv.innerHTML = `<p>Error fetching forecast data.</p>`;
            });
    }

    function getFiveDayForecast(city) {
        const url = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found.');
                }
                return response.json();
            })
            .then(data => {
                const locationKey = data[0].Key;
                return fetchFiveDayForecastData(locationKey);
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                fiveDayForecastDiv.innerHTML = `<p>${error.message}</p>`;
            });
    }

    function fetchFiveDayForecastData(locationKey) {
        const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts.length > 0) {
                    displayFiveDayForecast(data.DailyForecasts);
                } else {
                    fiveDayForecastDiv.innerHTML = `<p>No forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
                fiveDayForecastDiv.innerHTML = `<p>Error fetching forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherIcon = getWeatherIcon(weather);
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
            <img class="weather-icon" src="${weatherIcon}" alt="Weather Icon">
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayForecast(data) {
        forecastDiv.innerHTML = '<h2>12-Hour Forecast</h2>';
        data.forEach(forecast => {
            const time = new Date(forecast.DateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const temperature = forecast.Temperature.Value;
            const weather = forecast.IconPhrase;
            const weatherIcon = getWeatherIcon(weather);
            const forecastContent = `
                <div class="forecast-hour">
                    <h3>${time}</h3>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                    <img class="weather-icon" src="${weatherIcon}" alt="Weather Icon">
                </div>
            `;
            forecastDiv.innerHTML += forecastContent;
        });
    }

    function displayFiveDayForecast(data) {
        fiveDayForecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
        data.forEach(forecast => {
            const date = new Date(forecast.Date).toLocaleDateString();
            const minTemp = forecast.Temperature.Minimum.Value;
            const maxTemp = forecast.Temperature.Maximum.Value;
            const weather = forecast.Day.IconPhrase;
            const weatherIcon = getWeatherIcon(weather);
            const forecastContent = `
                <div class="forecast-day">
                    <h3>${date}</h3>
                    <p>Min: ${minTemp}°C</p>
                    <p>Max: ${maxTemp}°C</p>
                    <p>Weather: ${weather}</p>
                    <img class="weather-icon" src="${weatherIcon}" alt="Weather Icon">
                </div>
            `;
            fiveDayForecastDiv.innerHTML += forecastContent;
        });
    }

    function getWeatherIcon(weather) {
        switch(weather.toLowerCase()) {
            case 'sunny':
                return 'assets/sun.gif';
            case 'cloudy':
                return 'assets/cloudy.gif';
            case 'rainy':
                return 'assets/rain.gif';
    
        }
    }
});
