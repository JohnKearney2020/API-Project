window.addEventListener("load", () => {
    let long;
    let lat;
    let tempCont = document.querySelector(".temp")
    let sumCont = document.querySelector(".summary")
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
                    const { temperature, summary, icon } = data.currently
                    // set DOM elements from the api
                    tempCont.textContent = temperature
                    sumCont.textContent = `Today: ${summary} currently.`
                    //set icon
                    setIcons(icon, document.querySelector(".icon"))
                })
        });
    }
    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: "black" })
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, skycons[currentIcon]);
    }
})

