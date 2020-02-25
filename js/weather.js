fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/34983279487e255ca75000221c62bb9f/29.7559698,-95.3573194`)
    .then((response) => {
        return response.json();
    })
    .then((res_array) => {
        console.log(res_array)
    })