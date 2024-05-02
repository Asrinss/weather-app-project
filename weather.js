

let currCity = "İstanbul";
let units = "metric";

// HTML öğelerini seçmek için kullanılır.
let city = document.querySelector(".weather-city");
let datetime = document.querySelector(".weather-datetime");
let weather__forecast = document.querySelector('.weather-forecast');
let weather__temperature = document.querySelector(".weather-temperature");
let weather__icon = document.querySelector(".weather-icon");
let weather__minmax = document.querySelector(".weather-minmax")
let weather__realfeel = document.querySelector('.weather-realfeel');
let weather__humidity = document.querySelector('.weather-humidity');
let weather__wind = document.querySelector('.weather-wind');
let weather__pressure = document.querySelector('.weather-pressure');

// arama kısmı
document.querySelector(".weather-search").addEventListener('submit', e => {
    let search = document.querySelector(".weather-searchform");
    //  sayfanın yeniden yüklenmesini  önler.
    e.preventDefault();
    // var olan şehri değiştir
    currCity = search.value;
    // hava durumu tahminlerini alır.
    getWeather();
    // tüm girdileri temizler
    search.value = ""
})

document.querySelector(".weather-current-location").addEventListener('click', () => {
    getWeatherByCurrentLocation();
});

// şu an ki konumu gösterir 
function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            API_KEY= "2f57959fb453622b50c6ddec5ed08c21";
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    updateWeatherInfo(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        }, error => {
            console.error('Error getting current location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        alert('Geolocation is not supported by your browser.');
    }
}
// derece
document.querySelector(".weather-unit-celsius").addEventListener('click', () => {
    if(units !== "metric"){
        
        units = "metric"
        getWeather()
    }
})

// zaman 
function convertTimeStamp(timestamp, timezone){
     const convertTimezone = timezone / 3600; 

    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    }
    return date.toLocaleString("en-US", options)
   
}



// ülke kodunu ülke adına dönüştürür.
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country)
}

function getWeather(){
    const API_KEY = "2f57959fb453622b50c6ddec5ed08c21";
// OpenWeatherMap API'sine bir istek gönderir ve isteğin yanıtını işler. 
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`).then(res => res.json()).then(data => {
    console.log(data)
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
    datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
    weather__forecast.innerHTML = `<p>${data.weather[0].main}`
    weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
    weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
    weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
    weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
    weather__humidity.innerHTML = `${data.main.humidity}%`
    weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
    weather__pressure.innerHTML = `${data.main.pressure} hPa`
})
}

document.addEventListener('DOMContentLoaded', () => {
    getWeather();
});