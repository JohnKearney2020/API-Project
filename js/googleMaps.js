var map;
var player1 = '3 Hermann Museum Cir Dr Houston';
var player2 =
        '1334 Brittmoore Rd Houston';
var durations = []; //this array will hold the duration times for the two trips we will calculate: player1 to player2, and player2 to player1.
var midpoint;
var duration = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 29.749907, lng: -95.358421},
        zoom: 13,
        mapTypeControl: false //this lets the user change the map type from roads to satellite, etc. This disables that.
    });
    $('#showDirections').on('click', function(event) {
        displayDirections();
    });
    // $('#showDirections').on('click', function(event) {
    //     callRestaurantAPI(midPointLat, midPointLng);
    // });
}

//============================================================================================================================
//                                                  Get Directions Function
//============================================================================================================================
    function displayDirections() {
        var travelMode = 'DRIVING';
        // var address = document.getElementById('zoom-to-area-text').value;
        // var origin = document.getElementById('InputAddress1').value;
        var origin = player1;
        // var destination = document.getElementById('InputAddress2').value;
        var destination = player2;
        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = makeMarkerIcon('0091ff');
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = makeMarkerIcon('FFFF24');
        var largeInfowindow = new google.maps.InfoWindow();

        var directionsService = new google.maps.DirectionsService; //we start by creating a new DirectionsService request
        var mode = 'DRIVING';
        directionsService.route({ //here we calculate the route
            // The origin is the passed in marker's position.
            origin: origin,
            // The destination is user entered address.
            destination: destination,
            travelMode: google.maps.TravelMode[mode], //the travel mode the user selected
        },function(response, status) {
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
            //---------------------------------------------------------------------------
            //                  Call the Restaurant API and get markers
            //---------------------------------------------------------------------------
            var midPointLat = midpoint.lat();
            console.log(`midpoint lat is: ${midPointLat}`);
            var midPointLng = midpoint.lng();
            console.log(`midpoint lng is: ${midPointLng}`);
            var nearbyRestaurantArray = callRestaurantAPI(midPointLat, midPointLng);
            // console.log('trying to print nearby restaurant arrray:');
            // console.log(nearbyRestaurantArray);
            if (status === google.maps.DirectionsStatus.OK) {
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
        }); //this is tied to the repsonse function above
    }

//============================================================================================================================
//                                                  Marker Function
//============================================================================================================================
    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(23, 37), //oddly, this needs to be defined twice
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(23, 37));
    return markerImage;
    }

//============================================================================================================================
//                                                  Populate InfoWindow Function
//============================================================================================================================
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateMidpointInfoWindow(marker, infowindow) {
        infowindow.setContent(`<div style="color: black">This is the midpoint between you and your companion.</div><div class="hidden" id="midPointCoords">${marker.position}</div>`);
        // infowindow.setContent(`<div>This is the midpoint between you and your companion.</div>`);
        infowindow.open(map, marker);
    }