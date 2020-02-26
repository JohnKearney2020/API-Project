window.addEventListener("load", () => {
    let long;
    let lat;
    let tempCont = document.querySelector(".temp")
    let sumCont = document.querySelector(".summary")
    let iconCont = document.querySelector(".icon")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            long = position.coords.longitude
            lat = position.coords.latitude
            const proxy = 'https://cors-anywhere.herokuapp.com/'
            const api = `${proxy}https://api.darksky.net/forecast/34983279487e255ca75000221c62bb9f/${lat},${long}`
            fetch(api)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    const { temperature, summary, icon, precipProbability, apparentTemperature } = data.currently
                    // set DOM elements from the api
                    tempCont.textContent = temperature
                    sumCont.textContent = `Today: ${summary} currently. With ${precipProbability}% chance of rain. Feels ${apparentTemperature}`
                    // iconCont.innerHTML = icon
                    switch (icon) {
                        case "clear-night":
                            iconCont.innerHTML = '<img src="images/icons-weather/clear-night.png">'
                            break;
                        case ("clear-day"):
                            console.log("its clear day")
                            iconCont.innerHTML = '<img src="images/icons-weather/clear-day.png">'
                            break;
                        case ("cloudy"):
                            iconCont.innerHTML = '<img src="images/icons-weather/cloudy.png">'
                            break;
                        case ("fog"):
                            iconCont.innerHTML = '<img src="images/icons-weather/fog.png">'
                            break;
                        case ("partly-cloudy-day"):
                            iconCont.innerHTML = '<img src="images/icons-weather/partly-cloudy-day.png">'
                            break;
                        case ("partly-cloudy-night"):
                            iconCont.innerHTML = '<img src="images/icons-weather/partly-cloudy-night.png">'
                            break;
                        case ("rain"):
                            iconCont.innerHTML = '<img src="images/icons-weather/rain.png">'
                            break;
                        case ("sleet"):
                            iconCont.innerHTML = '<img src="images/icons-weather/sleet.png">'
                            break;
                        case ("snow"):
                            iconCont.innerHTML = '<img src="images/icons-weather/snow.png">'
                            break;
                        case ("wind"):
                            iconCont.innerHTML = '<img src="images/icons-weather/wind.png">'
                            break;
                    }
                })
        });
    }
})

