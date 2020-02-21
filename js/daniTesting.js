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
        let $listGroupContainer = $('.list-group');
        // console.log(arrayOfNearby)
        let liTags = arrayOfNearby.map((e) => {
            // console.log(e.restaurant.id)
            fetch(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${e.restaurant.id}`, {
                    headers: {
                        "user-key": "bf6c0110a83f00fcbdc7913c5bdc9dc0"
                    }
                })
                .then((response) => {
                    return response.json();
                })
                .then((restaurant_info) => {
                    console.log(restaurant_info)
                    // var arrayOfPhotos = restaurant_info.photos
                    // arrayOfPhotos.forEach((e) => {
                    //     console.log(e.photo.url)
                    //     console.log(e.photo.thumb_url)
                    // })
                })

        })

    })