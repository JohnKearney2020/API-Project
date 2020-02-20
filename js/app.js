// curl - X GET
//     --header "Accept: application/json"--header "user-key: bf6c0110a83f00fcbdc7913c5bdc9dc0"
// "https://developers.zomato.com/api/v2.1/geocode?lat=29.7955405&lon=-95.5675944"

fetch(`https://developers.zomato.com/api/v2.1/geocode?lat=29.7955405&lon=-95.5675944`, {
        headers: {
            "user-key": "bf6c0110a83f00fcbdc7913c5bdc9dc0"
        }
    })
    .then((response) => {
        return response.json();
    })
    .then((res_array) => {
        console.log(res_array)
    })