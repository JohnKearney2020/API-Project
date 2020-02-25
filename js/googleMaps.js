//==========================================================================================================================================
                                                       // Minimum Viable Product Code
//==========================================================================================================================================


var map;
console.log('google maps js link ok');
// var player1 = '3 Hermann Museum Cir Dr Houston';
// var player2 = '3 Hermann Museum Cir Dr Houston';
var player2 = '2101 E NASA Pkwy, Houston, TX 77058';
// var player2 =
//         '1334 Brittmoore Rd Houston';
var player1 =
        '1334 Brittmoore Rd Houston';
var durations = []; //this array will hold the duration times for the two trips we will calculate: player1 to player2, and player2 to player1.
var midpoint;
var duration = 0;
var restaurantMarkers = [];
var midPointMarker = [];

// var restarauntIcon = 'https://i.imgur.com/dV2Lj7E.png';


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 29.749907, lng: -95.358421},
        zoom: 10.6,
        mapTypeControl: false //this lets the user change the map type from roads to satellite, etc. This disables that.
    });
    $('#showDirections').on('click', function(event) {
        displayDirections();
    });
}

    

//============================================================================================================================
//                                                  Get Directions Function
//============================================================================================================================
    function displayDirections() {
        //----------------------------------------
        // clear any existing restaurant markers
        //----------------------------------------
        removeMarkers();
        function removeMarkers(){
            for(i=0; i<restaurantMarkers.length; i++){
                restaurantMarkers[i].setMap(null); //this removes the markers from the map, but does not delete them
            }
            restaurantMarkers = []; //we need to reset the array completely after we remove the markers from the map. This 'deletes' the markers.
        }
        //----------------------------------------
        //  clear any existing midpoint markers
        //----------------------------------------
        if(midPointMarker.length > 0){
            midPointMarker[0].setMap(null);
            midPointMarker = [];
        }

        var travelMode = 'DRIVING';
        var origin = player1;
        var destination = player2;
        // Style the markers a bit. This will be our listing marker icon.
        // var defaultIcon = makeMidMarkerIcon('0091ff');
        var defaultIcon = makeMidMarkerIcon('af7ac5');
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMidMarkerIcon('FFFF24');
        var restarauntIcon = makeRestaurantMarkerIcon('C70039');
        // var highlightedRestaurantIcon = makeRestaurantMarkerIcon('ec7063');
        var highlightedRestaurantIcon = makeRestaurantMarkerIcon('fdfefe');
        var largeInfowindow = new google.maps.InfoWindow();

        var directionsService = new google.maps.DirectionsService; //we start by creating a new DirectionsService request
        var mode = 'DRIVING';
        directionsService.route({ //here we calculate the route
            // The origin is the passed in marker's position.
            origin: origin,
            // The destination is user entered address.
            destination: destination,
            travelMode: google.maps.TravelMode[mode], //the travel mode the user selected
        }, function(response, status) {
            console.log(response);
            var totalPointsInRoute = response.routes[0].overview_path.length;
            console.log(totalPointsInRoute); //this is the total number of points in our route
            var midpointIndex = Math.round(totalPointsInRoute / 2);
            console.log(`midpoint index is: ${midpointIndex}`);
            // var midpoint = response.routes[0].overview_path[parseInt( numberofWaypoints / 2)];
            // var midpoint = response.routes[0].overview_path[midpointIndex];
            var distanceSum = 0;
            var timeSum = 0;
            var totalDistance = response.routes[0].legs[0].distance['value'];
            // console.log(`total distance is: ${totalDistance}`);
            var totalTime = response.routes[0].legs[0].duration['value'];
            var midPointTime = Math.round(totalTime / 2);
            var numberOfSteps = response.routes[0].legs[0].steps.length;
            console.log(`total time is: ${totalTime}`);
            var distanceSum = 0;
            var timeSum = 0;
            var pathPointSum = 0;
            var stepPathMidpointIndex = 0;
            var midpoint;
            /* Below, we loop through each step in the leg
            As we loop, we tally the duration of each step and add it to our total duration
            once our tally is greater than our midPointTime defined earlier, we know we are in the right step to find the midpoint
            each step is broken down into small point collections called paths. We find the middle path, and choose that as our midpoint */
            for(let i = 0; i < numberOfSteps; i++) {
                timeSum += response.routes[0].legs[0].steps[i].duration['value']; //add the time of each step
                let pathLength = response.routes[0].legs[0].steps[i].path.length; //the number of paths in the step
                // pathPointSum += response.routes[0].legs[0].steps[i].path.length;
                if(timeSum > midPointTime) { //this will be true when we reach the step that contains our time midpoint
                    //here we get the points that make up this step
                    stepPathMidpointIndex = Math.round((pathLength - 1)/2); //we find the midpoint path
                    midpoint = response.routes[0].legs[0].steps[i].path[stepPathMidpointIndex];
                    break; //once we've found the time midpoint we don't need to keep looping
                }
            }
            // var midpoint = response.routes[0].overview_path[midpointIndex];
            console.log(`midpoint is ${midpoint}`);
            // console.log(`Total path points: ${pathPointSum}`);

            //----------------------------------------------------
            //       Create a marker Icon for the Midpoint
            //----------------------------------------------------
            var marker = new google.maps.Marker({
                map: map,
                position:new google.maps.LatLng(midpoint.lat(),midpoint.lng()),
                title :'Mid Point',
                icon: defaultIcon
            });
            marker.addListener('click', function() {
                populateMidpointInfoWindow(this, largeInfowindow);
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
            });
            midPointMarker.push(marker);

            //===========================================================================================================================================
            //                                                     Get Restaurant Info
            //===========================================================================================================================================
            // console.log(midpoint.lat());
            let nearbyRestaurants = [];
            // let restaurantMarkers = [];
            $.get(`https://developers.zomato.com/api/v2.1/search?entity_id=277&entity_type=city&count=100&lat=${midpoint.lat()}&lon=${midpoint.lng()}&radius=3000&sort=real_distance&apikey=05c4a1701a35a643b3bd67c27c6045e7`)
            .done((results)=>{
                nearbyRestaurants = [...nearbyRestaurants,...results.restaurants];
                console.log(nearbyRestaurants);
            })
            .done(()=>{
                // //clear any existing restaurant markers
                // removeMarkers();
                // function removeMarkers(){
                //     for(i=0; i<restaurantMarkers.length; i++){
                //         restaurantMarkers[i].setMap(null);
                //     }
                // }
                for(let i = 0; i < nearbyRestaurants.length; i++) {
                    // console.log(`${i}`);
                    // console.log(new google.maps.LatLng(nearbyRestaurants[i].restaurant.location.latitude, nearbyRestaurants[i].restaurant.location.longitude));
                    var restaurantMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(nearbyRestaurants[i].restaurant.location.latitude, nearbyRestaurants[i].restaurant.location.longitude),
                        title: nearbyRestaurants[i].restaurant.name,
                        icon: restarauntIcon, //this specifies the icon we will be using
                        animation: google.maps.Animation.DROP,
                        id: i
                    });
                // Two event listeners - one for mouseover, one for mouseout, to change the colors back and forth.
                restaurantMarker.addListener('mouseover', function() {
                    this.setIcon(highlightedRestaurantIcon);
                });
                restaurantMarker.addListener('mouseout', function() {
                    this.setIcon(restarauntIcon);
                });
                var infowindow = new google.maps.InfoWindow;
                    google.maps.event.addListener(restaurantMarker, 'click', (function(restaurantMarker){
                        return function(){
                            infowindow.setContent(`<div id="content" style="color:black">`+ `<h4 class="font" id="firstHeading">${nearbyRestaurants[i].restaurant.name}</h4>`+
                            `<p class="font">${nearbyRestaurants[i].restaurant.location.address}</p>`+`<p class="font">${nearbyRestaurants[i].restaurant.timings}</p>`+
                            `<p class="font">${nearbyRestaurants[i].restaurant.cuisines}</p>`+ `<p class="font">${nearbyRestaurants[i].restaurant.phone_numbers}</p>`+
                            `</div>`);
                            infowindow.open(map, marker)
                        }
                    })(marker));
                restaurantMarkers.push(restaurantMarker); //ass the current 
                }
                // console.log(`${restaurantMarkers}`);
                setTimeout(function(){ //this will let the route and midpoint load on the map first, then after a short time our restaurant markers pop in to the map
                    showRestaurantMarkers();
                }, 1500);
                // showRestaurantMarkers();
                // This function will loop through the markers array and display them all
                function showRestaurantMarkers() {
                    for (var i = 0; i < restaurantMarkers.length; i++) {
                        restaurantMarkers[i].setMap(map);
                    }
                }
            });

            if (status === google.maps.DirectionsStatus.OK) {
                console.log('restaurants result check');
            var directionsDisplay = new google.maps.DirectionsRenderer({ //we need to create a new directions renderer
            //this renderer displays the detailed steps and polylines
                map: map, //specifies which map we want, itc our map
                directions: response, //specify we get the directions from our route response
                draggable: true, //route is draggable
                polylineOptions: {
                strokeColor: 'green' //route is green
                },
            });
            } else {
            window.alert('Directions request failed due to ' + status);
            }
        });
        }

//============================================================================================================================
//                                                  Marker Function
//============================================================================================================================
    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMidMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(23, 37), //oddly, this needs to be defined twice
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(23, 37));
    return markerImage;
    }

    function makeRestaurantMarkerIcon(markerColor) {
        // var markerImage = new google.maps.MarkerImage(
        //     'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        //     '|40|_|%E2%80%A2',
        var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
            new google.maps.Size(23, 37), //oddly, this needs to be defined twice
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(23, 37));
        return markerImage;
        }

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateMidpointInfoWindow(marker, infowindow) {
        infowindow.setContent(`<div style="color: black">This is the midpoint between you and your companion.</div><div class="hidden" id="midPointCoords">${marker.position}</div>`);
        infowindow.open(map, marker);
    }


// =====================================================
// New infowindow function for street view tutorial
// =====================================================
function populateRestaurantInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
    });
    infowindow.setContent(`<div style="color: black">Test</div>`);
    infowindow.open(map, marker);
    }
}







// var map;
// // console.log('google maps js link ok');
// var player1 = '3 Hermann Museum Cir Dr Houston';
// var player2 =
//         '1334 Brittmoore Rd Houston';
// var durations = []; //this array will hold the duration times for the two trips we will calculate: player1 to player2, and player2 to player1.
// var midpoint;
// var duration = 0;

// let myFirstPromise = new Promise((resolve, reject) => {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: 29.749907, lng: -95.358421},
//         zoom: 13,
//         mapTypeControl: false //this lets the user change the map type from roads to satellite, etc. This disables that.
//     });
//     // var largeInfowindow = new google.maps.InfoWindow();
//     resolve(map);
// });

// myFirstPromise.then(() => {
//     // successMessage is whatever we passed in the resolve(...) function above.
//     // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
//     console.log('first promise pass successful')

//         $('#showDirections').on('click', function(event) {
//             displayDirections();
//         });
// });

//---------------------------------------------------------------------------------------------------------
//                            Test Display Directions Function
//---------------------------------------------------------------------------------------------------------
// function displayDirections() {
//     myFirstPromise.then(() => {
//         // successMessage is whatever we passed in the resolve(...) function above.
//         // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
//         console.log('displayDirections function sucessfully called');
//         });
//     myFirstPromise.then(() => {
//         // successMessage is whatever we passed in the resolve(...) function above.
//         // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
//         console.log('in displayDirections, we have executed a second call from the promise');
//         });
// }


    

//============================================================================================================================
//                                                  Get Directions Function
//============================================================================================================================
//     function displayDirections() {
//         myFirstPromise.then(() => {
//             console.log('displayDirections function sucessfully called');
//             var travelMode = 'DRIVING';
//             var origin = player1;
//             var destination = player2;
//             // Style the markers a bit. This will be our listing marker icon.
//             var defaultIcon = makeMarkerIcon('0091ff');
//             // Create a "highlighted location" marker color for when the user
//             // mouses over the marker.
//             var highlightedIcon = makeMarkerIcon('FFFF24');
//             // var largeInfowindow = new google.maps.InfoWindow();
//         });
//         myFirstPromise.then(() => {        
//             var travelMode = 'DRIVING';
//             var origin = player1;
//             var destination = player2;
//             // Style the markers a bit. This will be our listing marker icon.
//             var defaultIcon = makeMarkerIcon('0091ff');
//             // Create a "highlighted location" marker color for when the user
//             // mouses over the marker.
//             var highlightedIcon = makeMarkerIcon('FFFF24');
//             var largeInfowindow = new google.maps.InfoWindow();
//             var directionsService = new google.maps.DirectionsService; //we start by creating a new DirectionsService request
//             var mode = 'DRIVING';
//             directionsService.route({ //here we calculate the route
//                 // The origin is the passed in marker's position.
//                 origin: origin,
//                 // The destination is user entered address.
//                 destination: destination,
//                 travelMode: google.maps.TravelMode[mode], //the travel mode the user selected
//             }, function(response, status) {
//                 console.log(response);
//                 var totalPointsInRoute = response.routes[0].overview_path.length;
//                 console.log(totalPointsInRoute); //this is the total number of points in our route
//                 var midpointIndex = Math.round(totalPointsInRoute / 2);
//                 console.log(`midpoint index is: ${midpointIndex}`);
//                 // var midpoint = response.routes[0].overview_path[parseInt( numberofWaypoints / 2)];
//                 // var midpoint = response.routes[0].overview_path[midpointIndex];
//                 var distanceSum = 0;
//                 var timeSum = 0;
//                 var totalDistance = response.routes[0].legs[0].distance['value'];
//                 // console.log(`total distance is: ${totalDistance}`);
//                 var totalTime = response.routes[0].legs[0].duration['value'];
//                 var midPointTime = Math.round(totalTime / 2);
//                 var numberOfSteps = response.routes[0].legs[0].steps.length;
//                 console.log(`total time is: ${totalTime}`);
//                 var distanceSum = 0;
//                 var timeSum = 0;
//                 var pathPointSum = 0;
//                 var stepPathMidpointIndex = 0;
//                 var midpoint;
//                 /* Below, we loop through each step in the leg
//                 As we loop, we tally the duration of each step and add it to our total duration
//                 once our tally is greater than our midPointTime defined earlier, we know we are in the right step to find the midpoint
//                 each step is broken down into small point collections called paths. We find the middle path, and choose that as our midpoint */
//                 for(let i = 0; i < numberOfSteps; i++) {
//                     timeSum += response.routes[0].legs[0].steps[i].duration['value']; //add the time of each step
//                     let pathLength = response.routes[0].legs[0].steps[i].path.length; //the number of paths in the step
//                     // pathPointSum += response.routes[0].legs[0].steps[i].path.length;
//                     if(timeSum > midPointTime) { //this will be true when we reach the step that contains our time midpoint
//                         //here we get the points that make up this step
//                         stepPathMidpointIndex = Math.round((pathLength - 1)/2); //we find the midpoint path
//                         midpoint = response.routes[0].legs[0].steps[i].path[stepPathMidpointIndex];
//                         break; //once we've found the time midpoint we don't need to keep looping
//                     }
//                 }
//                 // var midpoint = response.routes[0].overview_path[midpointIndex];
//                 console.log(`midpoint is ${midpoint}`);
//                 // console.log(`Total path points: ${pathPointSum}`);

//                 //----------------------------------------------------
//                 //       Create a marker Icon for the Midpoint
//                 //----------------------------------------------------
//                 var marker = new google.maps.Marker({
//                     map: map,
//                     position:new google.maps.LatLng(midpoint.lat(),midpoint.lng()),
//                     title :'Mid Point',
//                     icon: defaultIcon
//                 });
//                 marker.addListener('click', function() {
//                     populateMidpointInfoWindow(this, largeInfowindow);
//                 });
//                 // Two event listeners - one for mouseover, one for mouseout,
//                 // to change the colors back and forth.
//                 marker.addListener('mouseover', function() {
//                 this.setIcon(highlightedIcon);
//                 });
//                 marker.addListener('mouseout', function() {
//                 this.setIcon(defaultIcon);
//                 });

//                 if (status === google.maps.DirectionsStatus.OK) {
//                 var directionsDisplay = new google.maps.DirectionsRenderer({ //we need to create a new directions renderer
//                 //this renderer displays the detailed steps and polylines
//                     map: map, //specifies which map we want, itc our map
//                     directions: response, //specify we get the directions from our route response
//                     draggable: true, //route is draggable
//                     polylineOptions: {
//                     strokeColor: 'green' //route is green
//                     },
//                 });
//                 } else {
//                 window.alert('Directions request failed due to ' + status);
//                 }
//             }); //tied to the route pull
//     }); //tied to second promise pull
// };


// //============================================================================================================================
// //                                                  Marker Function
// //============================================================================================================================
//     // This function takes in a COLOR, and then creates a new marker
//     // icon of that color. The icon will be 21 px wide by 34 high, have an origin
//     // of 0, 0 and be anchored at 10, 34).
//     function makeMarkerIcon(markerColor) {
//     var markerImage = new google.maps.MarkerImage(
//         'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
//         '|40|_|%E2%80%A2',
//         new google.maps.Size(23, 37), //oddly, this needs to be defined twice
//         new google.maps.Point(0, 0),
//         new google.maps.Point(10, 34),
//         new google.maps.Size(23, 37));
//     return markerImage;
//     }

//     // This function populates the infowindow when the marker is clicked. We'll only allow
//     // one infowindow which will open at the marker that is clicked, and populate based
//     // on that markers position.
//     function populateMidpointInfoWindow(marker, infowindow) {
//         infowindow.setContent(`<div style="color: black">This is the midpoint between you and your companion.</div><div class="hidden" id="midPointCoords">${marker.position}</div>`);
//         infowindow.open(map, marker);
//     }