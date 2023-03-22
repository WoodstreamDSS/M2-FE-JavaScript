/*

Note: HTML5 Geolocation can only be done on sites with SSL. HTTPS only, no HTTP.

Usage: getLocation() returns an object with the following keys: state, status, latitude, longitude. Status will return as 'fail' if the user prevents the browser from getting the location, or if the browser does not support the feature.

Because this is asynchronous, pass the function another function as a callback to execute once the response is obtained.

Ex:

    function locationHandler(data) {
        console.log(data.state);
    }

    woodstream.getLocation(locationHandler);

Result (in console):

> Pennsylvania 

*/


WS.prototype.getLocation = function(callback) { 
    
    'use strict';
    
    var locationObj = {};
    
    var stateCoords = [
        { "state": "Alabama", "lat": 32.806671, "lng": -86.791130 }, 
        { "state": "Alaska", "lat": 61.370716, "lng": -152.404419 }, 
        { "state":"Arizona", "lat":33.729759, "lng":-111.431221 },
        { "state":"Arkansas", "lat":34.969704, "lng":-92.373123 },
        { "state":"California", "lat":36.116203, "lng": -119.681564 },
        { "state":"Colorado", "lat":39.059811, "lng":-105.311104 },
        { "state":"Connecticut", "lat":41.597782, "lng":-72.755371 },
        { "state":"Delaware", "lat":39.318523, "lng":-75.507141 },
        { "state":"District of Columbia", "lat":38.897438, "lng":-77.026817 },
        { "state":"Florida", "lat":27.766279, "lng":-81.686783 },
        { "state":"Georgia", "lat":33.040619, "lng":-83.643074 },
        { "state":"Hawaii", "lat":21.094318, "lng":-157.498337 },
        { "state":"Idaho", "lat":44.240459, "lng":-114.478828 },
        { "state":"Illinois", "lat":40.349457, "lng":-88.986137 },
        { "state":"Indiana", "lat":39.849426, "lng":-86.258278 },
        { "state":"Iowa", "lat":42.011539, "lng":-93.210526 },
        { "state":"Kansas", "lat":38.5266, "lng":-96.726486 },
        { "state":"Kentucky", "lat":37.66814, "lng":-84.670067 },
        { "state":"Louisiana", "lat":31.169546, "lng":-91.867805 },
        { "state":"Maine", "lat":44.693947, "lng":-69.381927 },
        { "state":"Maryland", "lat":39.063946, "lng":-76.802101 },
        { "state":"Massachusetts", "lat":42.230171, "lng":-71.530106 },
        { "state":"Michigan", "lat":43.326618, "lng":-84.536095 },
        { "state":"Minnesota", "lat":45.694454, "lng":-93.900192 },
        { "state":"Mississippi", "lat":32.741646, "lng":-89.678696 },
        { "state":"Missouri", "lat":38.456085, "lng":-92.288368 },
        { "state":"Montana", "lat":46.921925, "lng":-110.454353 },
        { "state":"Nebraska", "lat":41.12537, "lng":-98.268082 },
        { "state":"Nevada", "lat":38.313515, "lng":-117.055374 },
        { "state":"New Hampshire", "lat":43.452492, "lng":-71.563896 },
        { "state":"New Jersey", "lat":40.298904, "lng":-74.521011 },
        { "state":"New Mexico", "lat":34.840515, "lng":-106.248482 },
        { "state":"New York", "lat":42.165726, "lng":-74.948051 },
        { "state":"North Carolina", "lat":35.630066, "lng":-79.806419 },
        { "state":"North Dakota", "lat":47.528912, "lng":-99.784012 },
        { "state":"Ohio", "lat":40.388783, "lng":-82.764915 },
        { "state":"Oklahoma", "lat":35.565342, "lng":-96.928917 },
        { "state":"Oregon", "lat":44.572021, "lng":-122.070938 },
        { "state":"Pennsylvania", "lat":40.59075, "lng":-77.209755 },
        { "state":"Rhode Island", "lat":41.680893, "lng":-71.51178 },
        { "state":"South Carolina", "lat":33.856892, "lng":-80.945007 },
        { "state":"South Dakota", "lat":44.299782, "lng":-99.438828 },
        { "state":"Tennessee", "lat":35.747845, "lng":-86.692345 },
        { "state":"Texas", "lat":31.054487, "lng":-97.563461 },
        { "state":"Utah", "lat":40.150032, "lng":-111.862434 },
        { "state":"Vermont", "lat":44.045876, "lng":-72.710686 },
        { "state":"Virginia", "lat":37.769337, "lng":-78.169968 },
        { "state":"Washington", "lat":47.400902, "lng":-121.490494 },
        { "state":"West Virginia", "lat":38.491226, "lng":-80.954453 },
        { "state":"Wisconsin", "lat":44.268543, "lng":-89.616508 },
        { "state":"Wyoming", "lat":42.755966, "lng":-107.3024 },
    ];    
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, errorHandler);
    } else { 
        errorHandler();
    }
    
    function showPosition(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var bestIdx = 0;
        var shortest = 100;
        for (var i = 0; i < stateCoords.length; i++) {
            var a = lat - stateCoords[i].lat;
            var b = lng - stateCoords[i].lng;
            var c = Math.sqrt(a*a + b*b);
            if (c < shortest) { bestIdx = i; shortest = c; }
        }
        locationObj.state = stateCoords[bestIdx].state;
        locationObj.lng = lng;
        locationObj.lat = lat;
        locationObj.status = 'success';
        callback(locationObj);
    }
    
    function errorHandler() {
        locationObj.state = '';
        locationObj.lng = 0;
        locationObj.lat = 0;
        locationObj.status = 'fail';
        callback(locationObj);
    }
};