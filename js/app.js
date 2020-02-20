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
            console.log(e)
            console.log(e.restaurant.id)
            console.log(e.restaurant.name)
            // console.log(e.restaurant.location.address)
            // console.log(e.restaurant.location)
            // console.log(e.restaurant.location.latitude, e.restaurant.location.longitude)
        })
    })

// curl - X GET--header "Accept: application/json"--header "user-key: bf6c0110a83f00fcbdc7913c5bdc9dc0"
// "https://developers.zomato.com/api/v2.1/restaurant?res_id=16879929"
var restaurant_id = "16879823"

fetch(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${restaurant_id}`, {
        headers: {
            "user-key": "bf6c0110a83f00fcbdc7913c5bdc9dc0"
        }
    })
    .then((response) => {
        return response.json();
    })
    .then((restaurant_info) => {
        // console.log(restaurant_info.menu_url)
        // gives link to the menu 
        // console.log(restaurant_info.photos)
        var arrayOfPhotos = restaurant_info.photos
        // console.log(arrayOfPhotos)
        arrayOfPhotos.forEach((e) => {
            // console.log(e)
            // console.log(e.photo.url)
            console.log(e.photo.thumb_url)
        })
    })