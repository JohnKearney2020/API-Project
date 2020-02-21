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
        console.log(res_array.nearby_restaurants)
        let $listGroupContainer = $('.list-group');
        let liTags = arrayOfNearby.map((e) => {
            return `<a class='list-group-item list-group-item-action' href="${e.restaurant.url}">${e.restaurant.name}</a>`
        })
        $listGroupContainer.html(liTags.join(''));
    })

$div = $(".list-group");
$div.click((e) => {
    alert('ouch')
})