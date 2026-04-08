/* ============================
   WEATHER APP JS - FULL CLEAN + LOCAL AUTOCOMPLETE
=============================== */

const API_KEY = "YOUR_API_KEY_HERE"; // 🔑 Remplace par ta vraie clé
let isCelsius = true;

// ============================
// LISTE DE 150 VILLES
// ============================
const worldCities = [
  // ---------------- AFRIQUE (50) ----------------
  "Kinshasa, DR Congo","Lubumbashi, DR Congo","Mbuji-Mayi, DR Congo",
  "Kisangani, DR Congo","Goma, DR Congo","Matadi, DR Congo","Bukavu, DR Congo",
  "Likasi, DR Congo","Kolwezi, DR Congo","Kananga, DR Congo","Bunia, DR Congo",
  "Kalemie, DR Congo","Kindu, DR Congo","Uvira, DR Congo","Kikwit, DR Congo",
  "Boma, DR Congo","Isiro, DR Congo","Mwene-Ditu, DR Congo","Butembo, DR Congo",
  "Gemena, DR Congo","Johannesburg, South Africa","Cape Town, South Africa",
  "Durban, South Africa","Pretoria, South Africa","Port Elizabeth, South Africa",
  "Casablanca, Morocco","Rabat, Morocco","Marrakesh, Morocco","Fes, Morocco",
  "Tangier, Morocco","Algiers, Algeria","Oran, Algeria","Cairo, Egypt",
  "Alexandria, Egypt","Khartoum, Sudan","Addis Ababa, Ethiopia","Nairobi, Kenya",
  "Kampala, Uganda","Accra, Ghana","Dakar, Senegal","Abidjan, Ivory Coast",
  "Bamako, Mali","Ouagadougou, Burkina Faso","Luanda, Angola","Maputo, Mozambique",
  "Tunis, Tunisia","Mombasa, Kenya","Dar es Salaam, Tanzania","kigali, Rwanda", "Gitega,Burundi", "Bujumbura, Burundi",
  // ---------------- EUROPE (30) ----------------
  "London, UK","Paris, France","Berlin, Germany","Madrid, Spain","Rome, Italy",
  "Amsterdam, Netherlands","Brussels, Belgium","Vienna, Austria","Lisbon, Portugal",
  "Warsaw, Poland","Prague, Czech Republic","Budapest, Hungary","Dublin, Ireland",
  "Oslo, Norway","Stockholm, Sweden","Helsinki, Finland","Copenhagen, Denmark",
  "Athens, Greece","Zurich, Switzerland","Geneva, Switzerland","Edinburgh, UK",
  "Manchester, UK","Barcelona, Spain","Valencia, Spain","Munich, Germany",
  "Frankfurt, Germany","Milan, Italy","Naples, Italy","Venice, Italy","Florence, Italy",
  // ---------------- ASIE (30) ----------------
  "Tokyo, Japan","Osaka, Japan","Beijing, China","Shanghai, China","Hong Kong, China",
  "Seoul, South Korea","Busan, South Korea","Bangkok, Thailand","Singapore, Singapore",
  "Kuala Lumpur, Malaysia","Jakarta, Indonesia","Manila, Philippines","Delhi, India",
  "Mumbai, India","Bangalore, India","Karachi, Pakistan","Lahore, Pakistan",
  "Tehran, Iran","Baghdad, Iraq","Dubai, UAE","Abu Dhabi, UAE","Doha, Qatar",
  "Riyadh, Saudi Arabia","Jeddah, Saudi Arabia","Kathmandu, Nepal","Colombo, Sri Lanka",
  "Hanoi, Vietnam","Ho Chi Minh City, Vietnam","Taipei, Taiwan","Ulaanbaatar, Mongolia",
  // ---------------- AMÉRIQUES (30) ----------------
  "New York, USA","Los Angeles, USA","Chicago, USA","Houston, USA","Phoenix, USA",
  "Toronto, Canada","Vancouver, Canada","Montreal, Canada","Mexico City, Mexico",
  "Guadalajara, Mexico","Monterrey, Mexico","São Paulo, Brazil","Rio de Janeiro, Brazil",
  "Brasília, Brazil","Buenos Aires, Argentina","Córdoba, Argentina","Rosario, Argentina",
  "Lima, Peru","Bogotá, Colombia","Medellín, Colombia","Quito, Ecuador","Caracas, Venezuela",
  "Santiago, Chile","Valparaíso, Chile","Montevideo, Uruguay","La Paz, Bolivia",
  "Sucre, Bolivia","Asunción, Paraguay","San Juan, Puerto Rico","Havana, Cuba",
  // ---------------- OCÉANIE (10) ----------------
  "Sydney, Australia","Melbourne, Australia","Brisbane, Australia","Perth, Australia",
  "Adelaide, Australia","Auckland, New Zealand","Wellington, New Zealand",
  "Suva, Fiji","Port Moresby, Papua New Guinea","Honolulu, Hawaii, USA"
];

document.addEventListener("DOMContentLoaded", () => {
  // ======= ELEMENTS DOM =======
  const cityEl = document.getElementById("city");
  const dateEl = document.getElementById("date");
  const tempEl = document.getElementById("temp");
  const iconEl = document.getElementById("icon");

  const feelsEl = document.getElementById("feels");
  const humidityEl = document.getElementById("humidity");
  const windEl = document.getElementById("wind");
  const precipEl = document.getElementById("precip");

  const dailyList = document.getElementById("dailyList");
  const hourlyContainer = document.getElementById("hourlyContainer");

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");

  const unitToggle = document.getElementById("unitToggle");

  const menuWrapper = document.getElementById('menuIcon');
  const menuList = document.getElementById('menuList');
  const selectedDay = menuWrapper.querySelector('.selected-day');

  // ============================
  // FETCH WEATHER DATA
  // ============================
  async function getWeather(city = "Berlin, Germany") {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
      );
      const data = await res.json();
      updateUI(data);
    } catch (err) {
      console.error("Erreur fetch météo :", err);
    }
  }

  // ============================
  // UPDATE UI
  // ============================
  function updateUI(data) {
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast;

    cityEl.textContent = `${location.name}, ${location.country}`;
    dateEl.textContent = new Date().toDateString();

    tempEl.textContent = isCelsius
      ? Math.round(current.temp_c) + "°"
      : Math.round(current.temp_f) + "°";

    iconEl.src = "https:" + current.condition.icon;
    feelsEl.textContent = isCelsius ? current.feelslike_c + "°" : current.feelslike_f + "°";
    humidityEl.textContent = current.humidity + "%";
    windEl.textContent = current.wind_kph + " km/h";
    precipEl.textContent = current.precip_mm + " mm";

    // DAILY FORECAST
    dailyList.innerHTML = "";
    forecast.forecastday.forEach(day => {
      dailyList.innerHTML += `
        <div class="day">
          <p>${new Date(day.date).toLocaleDateString("en-US", { weekday: 'short' })}</p>
          <img src="https:${day.day.condition.icon}" alt="">
          <span>${Math.round(day.day.maxtemp_c)}° ${Math.round(day.day.mintemp_c)}°</span>
        </div>
      `;
    });

    // HOURLY FORECAST
    hourlyContainer.innerHTML = `<h3>Hourly Forecast</h3>`;
    forecast.forecastday[0].hour.forEach(h => {
      hourlyContainer.innerHTML += `
        <div class="hour">
          <div class="hour-left">
            <img src="https:${h.condition.icon}" alt="">
            ${h.time.split(" ")[1]}
          </div>
          <span>${isCelsius ? Math.round(h.temp_c) : Math.round(h.temp_f)}°</span>
        </div>
      `;
    });
  }

  // ============================
  // UNIT TOGGLE °C / °F
  // ============================
  if (unitToggle) {
    unitToggle.addEventListener("click", () => {
      isCelsius = !isCelsius;
      const cityName = cityEl.textContent;
      getWeather(cityName);
    });
  }


  // ============================
  // MENU DROPDOWN DAYS
  // ============================
  if (menuWrapper && menuList) {
    menuWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      menuList.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!menuWrapper.contains(e.target)) {
        menuList.classList.remove('show');
      }
    });

    menuList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        selectedDay.textContent = li.textContent; // seul le jour sélectionné reste
        menuList.classList.remove('show');
      });
    });
  } 

  // ============================
  // SEARCH AUTOCOMPLETE (LOCAL)
  // ============================
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      suggestions.innerHTML = "";
      if (!query) return;

      const filtered = worldCities
        .filter(city => city.toLowerCase().includes(query))
        .slice(0, 10);

      filtered.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.addEventListener("click", () => {
            //Mise à jour immédiate du titre
            cityEl.textContent = city;
            
          getWeather(city);        // met à jour météo
          searchInput.value = "";  // vide input
          suggestions.innerHTML = "";
        });
        suggestions.appendChild(li);
      });
    });
  }

  // ============================
  // SEARCH BUTTON
  // ============================
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const city = searchInput.value.trim();
      if (city) getWeather(city);
    });
  }

  // ============================
  // INIT
  // ============================
  getWeather(); // fetch par défaut sur Berlin
});

const unitsBtn = document.getElementById("unitsBtn");
const unitsMenu = document.getElementById("unitsMenu");

unitsBtn.addEventListener("click", () => {
  unitsMenu.classList.toggle("active");
});

// fermer si clique ailleurs
document.addEventListener("click", (e) => {
  if (!unitsBtn.contains(e.target) && !unitsMenu.contains(e.target)) {
    unitsMenu.classList.remove("active");
  }
});

// gérer sélection
const options = unitsMenu.querySelectorAll(".option");

options.forEach(option => {
  option.addEventListener("click", () => {
    options.forEach(o => o.classList.remove("active"));
    option.classList.add("active");

    unitsBtn.textContent = option.textContent + " ⌄";
  });
});