


window.addEventListener("DOMContentLoaded", init);

function init() {
    //On the first load of the site
    if (localStorage.getItem("city")) {
        // Fetch weather conditions for that city
        fetchLocal(localStorage.getItem("city"))
            .then(weatherObj => {
                console.log("Rendering the UI from local storage term....");
                renderUI(weatherObj);
            })
            .catch(err => console.log(err));
    }
    console.log("inside the init method");
    setReferences();
    bindEvents();
}
function fetchLocal(city) {
    return new Promise(async (resolve, reject) => {
        const cityData = await fetchCityData(city.toLowerCase());
        const weatherConditions = await fetchCurrentConditions(cityData.Key);
        const obj = { cityData, weatherConditions };
        resolve(obj);
    });
    //   renderUI(obj);
}

function setReferences() {
    cityForm = document.querySelector("form");
    card = document.querySelector(".card");
    details = document.querySelector(".details");
    time = document.querySelector("img.time");
    icon = document.querySelector(".icon img");
}

async function fetchWeather(e) {
    e.preventDefault();
    // test
    const term = cityForm.city.value.toLowerCase().trim();
    try {
        // city data
        const cityData = await fetchCityData(term);
        // weather conditions
        const weatherConditions = await fetchCurrentConditions(cityData.Key);
        const cityWeatherObj = {
            cityData,
            weatherConditions
        };
        renderUI(cityWeatherObj);
        // set local storage
        localStorage.setItem("city", term);
    } catch (ex) {
        const error = new Error(
            "An error occured while fetching the consolidated data"
        );
        error.statusCode = 500;
        throw error;
    }
}

function renderUI(obj) {
    const { cityData, weatherConditions } = obj;
    // Update the template
    console.log(cityData);
    //   console.log(weatherConditions);
    details.innerHTML = `
            <h5 class="my-3">${cityData.EnglishName},${
        cityData.Country.LocalizedName
        }</h5>
            <div class="my-3">${weatherConditions.WeatherText}</div>
            <div class="my-3">Elevation : ${
        cityData.GeoPosition.Elevation.Imperial.Value
        } ${cityData.GeoPosition.Elevation.Imperial.Unit}</div>
            
            <div class="my-3">Latitude :${cityData.GeoPosition.Latitude}</div>
            <div class="my-3">Longitude :${cityData.GeoPosition.Longitude}</div>
            
            <div class="my-3">Precipitation : ${
        weatherConditions.HasPrecipitation
        }</div>
            <div class="display-4 my-4">
                <span>${weatherConditions.Temperature.Metric.Value}</span>
                <span>&deg;${weatherConditions.Temperature.Metric.Unit}</span>
            </div>
            
            `;

    let iconSrc = `img/icons/${weatherConditions.WeatherIcon}.svg`;
    let phase = !weatherConditions.IsDayTime ? "night" : "day";
    time.setAttribute("src", `img/${phase}.svg`);
    icon.setAttribute("src", iconSrc);
    //Render the card once you have the details
    if (card.classList.contains("d-none")) {
        card.classList.remove("d-none");
    }
}

function bindEvents() {
    cityForm.addEventListener("submit", fetchWeather);
}