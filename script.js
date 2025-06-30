const API_KEY = '5e76efdb4203e7819786c48bd58efa8f';

function getWeatherIcon(main) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️'
    };
    return icons[main] || '🌤️';
}

function displayWeather(data) {
    const container = document.getElementById('weatherContainer');
    const icon = getWeatherIcon(data.weather[0].main);
    container.innerHTML = `
        <div class="weather-card">
            <div class="main-weather">
                <div class="weather-icon">${icon}</div>
                <div class="weather-main">
                    <div class="temperature">${Math.round(data.main.temp)}°C</div>
                    <div class="location">${data.name}, ${data.sys.country}</div>
                    <div class="description">${data.weather[0].description}</div>
                </div>
                <div class="weather-icon" style="opacity: 0.3;">${icon}</div>
            </div>
            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-icon">🌡️</span>
                    <div class="detail-label">Feels Like</div>
                    <div class="detail-value">${Math.round(data.main.feels_like)}°C</div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">💧</span>
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${data.main.humidity}%</div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🌬️</span>
                    <div class="detail-label">Wind Speed</div>
                    <div class="detail-value">${data.wind.speed} m/s</div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🔽</span>
                    <div class="detail-label">Pressure</div>
                    <div class="detail-value">${data.main.pressure} hPa</div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">👁️</span>
                    <div class="detail-label">Visibility</div>
                    <div class="detail-value">${(data.visibility / 1000).toFixed(1)} km</div>
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    const container = document.getElementById('weatherContainer');
    container.innerHTML = `<div class="error">❌ ${message}</div>`;
}

function showLoading() {
    const container = document.getElementById('weatherContainer');
    container.innerHTML = '<div class="loading">🔄 Loading weather data...</div>';
}

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    showLoading();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found. Try another city.');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// Add some interactive particle effects
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'rgba(255, 255, 255, 0.6)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '-1';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = '-10px';
    document.body.appendChild(particle);
    const duration = Math.random() * 3000 + 2000;
    const drift = (Math.random() - 0.5) * 100;
    particle.animate([
        { transform: 'translateY(0px) translateX(0px)', opacity: 0 },
        { opacity: 1, offset: 0.1 },
        { opacity: 1, offset: 0.9 },
        { transform: `translateY(${window.innerHeight + 10}px) translateX(${drift}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => particle.remove();
}
setInterval(createParticle, 300); 