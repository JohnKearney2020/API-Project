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
        let arrayOfNearby = res_array.nearby_restaurants
        let $listGroupContainer = $('.list-group');
        let liTags = arrayOfNearby.map((e) => {
            // console.log(e)
            return `<li class='list-group-item list-group-item-action' id='${e.restaurant.id}'>${e.restaurant.name}</li>`
        })
        $listGroupContainer.html(liTags.join(''));
    })
$div = $(".list-group");
$div.click((e) => {
    let res_link = e.target
    let restaurant_id = res_link.getAttribute('id')
    fetch(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${restaurant_id}`, {
            headers: {
                "user-key": "bf6c0110a83f00fcbdc7913c5bdc9dc0"
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((restaurant_info) => {
            let arrayOfPhotos = restaurant_info.photos
            let imgTag = arrayOfPhotos.map((e) => {
                console.log(e.photo.thumb_url)
                // console.log(e.photo)
            })
        })
})