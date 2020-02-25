let weatherCont = document.querySelector('#whiteOnWhite')
let tempCont = document.querySelector(".temp")
let sumCont = document.querySelector(".summary")

fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/34983279487e255ca75000221c62bb9f/29.7559698,-95.3573194`)
    .then((response) => {
        return response.json();
    })
    .then((res_array) => {
        console.log(res_array)
        let arrayCurrent = res_array.currently
        let currentTemp = arrayCurrent.temperature + ' F'
        let currentSum = arrayCurrent.summary
        let currentIcon = arrayCurrent.icon
        console.log(currentTemp)
        console.log(currentSum)
        console.log(currentIcon)
    })





// var skycons = new Skycons({ "color": "pink" });
// var icons = new Skycons(),
// list  = [
//   "clear-day", "clear-night", "partly-cloudy-day",
//   "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
//   "fog"
// ],
// i;

// for(i = list.length; i--; )
// icons.set(list[i], list[i]);

// icons.play();