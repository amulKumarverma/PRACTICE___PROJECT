const API_KEY = "37720fdd526279b5ed1ab4a23b9af96c"; // ✅ your OpenWeather key

// ✅ Get weather data
async function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  return await res.json();
}

// ✅ Get NDVI data from OpenWeather Agro API
async function getVegetation(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/agro/1.0/ndvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(url);
  return await res.json();
}

// ✅ Simple pest risk model
function computePestRisk(weather, ndvi) {
  let risk = "Low";
  let reasons = [];

  const temp = weather.main.temp;
  const humidity = weather.main.humidity;

  if (humidity > 75) reasons.push("High Humidity");
  if (temp > 28 && temp < 35) reasons.push("Optimal Temp for Pests");

  if (ndvi < 0.4) reasons.push("Weak Vegetation (Low NDVI)");

  if (reasons.length >= 2) risk = "High";
  else if (reasons.length === 1) risk = "Medium";

  return { risk, reasons };
}

// ✅ Update UI
function updateUI(location, weather, ndvi, riskData) {
  document.getElementById("location").innerHTML = `<p>📍 Location: ${location}</p>`;

  document.getElementById("weather-info").innerHTML =
    `🌡 Temp: ${weather.main.temp}°C<br>💧 Humidity: ${weather.main.humidity}%<br>🌬 Wind: ${weather.wind.speed} m/s`;

  document.getElementById("veg-info").innerHTML =
    `NDVI: ${ndvi.toFixed(2)} (0 = poor, 1 = healthy)`;

  const riskEl = document.getElementById("risk-info");
  riskEl.textContent = `${riskData.risk} Risk (${riskData.reasons.join(", ")})`;
  riskEl.className = riskData.risk.toLowerCase();
}

// ✅ Detect location and fetch both weather + NDVI
function detectLocationAndFetch() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const weather = await getWeather(lat, lon);
      const vegData = await getVegetation(lat, lon);

      const ndvi = vegData?.data?.[0]?.mean || 0.5; // fallback 0.5

      const riskData = computePestRisk(weather, ndvi);

      updateUI(`${lat.toFixed(2)}, ${lon.toFixed(2)}`, weather, ndvi, riskData);
    });
  } else {
    alert("Geolocation not supported.");
  }
}

window.onload = detectLocationAndFetch;
