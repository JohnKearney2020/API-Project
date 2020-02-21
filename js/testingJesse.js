let nearbyRestaurantsArray = [];    
    $("#btn").click(()=>{
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition((position)=>{
                let $lat = position.coords.latitude;
                let $lon = position.coords.longitude;
                $.get(`https://developers.zomato.com/api/v2.1/geocode?lat=${$lat}&lon=${$lon}&apikey=05c4a1701a35a643b3bd67c27c6045e7`)
                .done((results)=>{
                    nearbyRestaurantsArray = results;
                    console.log(nearbyRestaurantsArray);
                    
                })
                .done(()=>{
                    

                    

                })
            })
    }
})
