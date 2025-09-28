const apiKey = "37720fdd526279b5ed1ab4a23b9af96c";
const weatherResult = document.getElementById("weatherResult");

// 🔍 Get weather by city name
async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();

  if (!city) {
    showMessage("❗ Please enter a city name");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

// 📍 Get weather by user's location
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        fetchWeather(url);
      },
      () => {
        showMessage("⚠️ Location access denied. Please search manually.");
      }
    );
  } else {
    showMessage("❌ Geolocation not supported by your browser.");
  }
}

// 🌦️ Fetch weather data
async function fetchWeather(url) {
  showLoader();

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      showMessage(`❗ ${data.message}`);
      return;
    }

    renderWeather(data);
  } catch (error) {
    showMessage("⚠️ Failed to fetch weather data. Please try again later.");
  }
}

// 🎨 Render weather to DOM
function renderWeather(data) {
  const { name, sys, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const condition = weather[0].main.toLowerCase();

  setBackground(condition);

  weatherResult.innerHTML = `
    <div class="weather-card">
      <h2>${name}, ${sys.country}</h2>
      <img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon" />
      <p><strong>🌡️ Temp:</strong> ${main.temp}°C</p>
      <p><strong>🌤️ Condition:</strong> ${weather[0].description}</p>
      <p><strong>💨 Wind:</strong> ${wind.speed} m/s</p>
      <p><strong>💧 Humidity:</strong> ${main.humidity}%</p>
    </div>
  `;
}

// 🔁 Set dynamic background
function setBackground(condition) {
  const body = document.body;
  let bgClass = "default-bg";

  if (condition.includes("cloud")) bgClass = "cloudy-bg";
  else if (condition.includes("rain")) bgClass = "rainy-bg";
  else if (condition.includes("clear")) bgClass = "sunny-bg";
  else if (condition.includes("snow")) bgClass = "snowy-bg";

  body.className = ""; // Remove existing background class
  body.classList.add(bgClass);
}

// 🌀 Show loader
function showLoader() {
  weatherResult.innerHTML = `
    <div class="loader"></div>
    <p>Fetching weather data...</p>
  `;
}

// 💬 Display a message
function showMessage(message) {
  weatherResult.innerHTML = `<p>${message}</p>`;
}

// 📦 On load
window.onload = getWeatherByLocation;
