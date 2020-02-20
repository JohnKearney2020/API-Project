// curl - X GET
//     --header "Accept: application/json"--header "user-key: bf6c0110a83f00fcbdc7913c5bdc9dc0"
// "https://developers.zomato.com/api/v2.1/geocode?lat=29.7955405&lon=-95.5675944"

var lat = "29.6173519"
var lon = "-95.2333921"
fetch(`https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lon}`, {
        headers: {
            "user-key": "bf6c0110a83f00fcbdc7913c5bdc9dc0"
        }
    })
    .then((response) => {
        return response.json();
    })
    .then((res_array) => {
        // console.log(res_array.nearby_restaurants)
        let arrayOfNearby = res_array.nearby_restaurants
        // console.log(arrayOfNearby)
        arrayOfNearby.forEach((e) => {
            console.log(e.restaurant.name)
        })
        // prints an array with 10 restaurants in that area

    })