/* CODE THAT IS EXECUTED */

const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?id=5317058&units=metric&APPID=9ec985f43b7fc537d4ab3d4953fb50ed"
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?id=5317058&units=metric&APPID=9ec985f43b7fc537d4ab3d4953fb50ed"

let div = document.getElementById("weather")
let weatherP = document.getElementById("weatherP")
weatherP.style = "display: inline;"
let dateTimeP = document.getElementById("dateTimeP")
let weatherIcon = document.createElement("i")

var sunrise;
var sunset;
var updateTime;

var triggeredSunset;
var triggeredSunrise;

var oldDay;

main()	
let timerId = setInterval(time, 1000)

var divider = document.getElementById("links")

links.forEach((item) => {
	var string = `${item.name} @ ${item.url}`
	var element = document.createElement("p")
	element.textContent = string
	divider.appendChild(element)
})

/* FUNCTIONS */

function main() {
	setWeather()
	setDateTime()	
}

async function setWeather() {
	let weatherData = await getWeatherJson()
	let farenheight = (weatherData.main.temp * (9/5) + 32).toFixed(2)
	weatherP.textContent = `${farenheight} °F / ${weatherData.main.temp} °C in ${weatherData.name} - ${weatherData.weather[0].description} `
	console.log(`${weatherData.weather[0].main}, ${weatherData.weather[0].icon}`)
	let weatherId = weatherData.weather[0].id
	var icon = weatherIconDict[weatherId].icon	
	if (!(weatherId >= 700 && weatherId < 800) && !(weatherId >= 900 && weatherId < 1000)) {
		let date = new Date()
		if (date.getTime() / 1000 > weatherData.sys.sunset || date.getTime() / 1000 < weatherData.sys.sunrise) {
			icon = "night-" + icon
			triggeredSunset = true
			triggeredSunrise = false
		}
		else {
			icon = "day-" + icon
			triggeredSunrise = true
			triggeredSunset = false
		}	
	}

	icon = "wi wi-" + icon
	weatherIcon.className += icon
	sunset = weatherData.sys.sunset
	sunrise = weatherData.sys.sunrise
	weatherP.appendChild(weatherIcon)
}

function setDateTime() {
	let date = new Date()
	let hrs = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
	let mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
	let secs = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
	dateTimeP.textContent = `${date.toLocaleDateString()} - ${hrs}:${mins}:${secs}`
	updateTime = date.getTime()
}

async function time() {
	let date = new Date()
	let hrs = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
	let mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
	let secs = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
	dateTimeP.textContent = `${date.toLocaleDateString()} - ${hrs}:${mins}:${secs}`

	// update weather information if it has been 10 minutes or if it is sunset/sunrise

	if (date.getTime() - updateTime > 10 * 60 * 1000) setWeather()
	else if ((date.getTime() / 1000 > sunset || date.getTime() / 1000 < sunrise) && !triggeredSunset) setWeather()
	else if ((date.getTime() / 1000 < sunset || date.getTime() / 1000 > sunrise) && !triggeredSunrise) setWeather()
	
	if (oldDay != date.getDay()) setWeather()	
}

async function getWeatherJson() {
		let json = await fetch(weatherUrl)
				.then((response) => {
						if (response.ok) {
								return response.json()
						}
				})
		return json
}