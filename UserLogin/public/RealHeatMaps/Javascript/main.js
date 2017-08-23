var myData = new Firebase("https://dreghisdb.firebaseio.com/HealthCenters");
var healthCenters;
var list = [];
myData.once('value', function(datasnapshot){
    var tempLocation, centerLocation = [], newLoc;
    healthCenters = datasnapshot.val();
    console.log(healthCenters);
    for(var key in healthCenters){
        tempLocation = {
            location: new google.maps.LatLng(healthCenters[key].Location.Lat, healthCenters[key].Location.Long)
        }
        //Create New Location for Health Center Marker
        newLoc = {lat: healthCenters[key].Location.Lat, lng: healthCenters[key].Location.Long};
        centerLocation.push(newLoc);
        for(i = 0; i < healthCenters[key].Trackers.Count; i++){
            list.push(tempLocation);
        }
    }
    //Initialize Map when Data Has bee
    initialize(centerLocation);
})
//Initialize Google Maps
function initialize(markerLocations){
    //var myLatLng = {lat: 10.6154, lng: -61.2134};
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(10.4, -61.4)
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    
    for(i = 0; i < markerLocations.length; i++){
        var marker = new google.maps.Marker({
            position: markerLocations[i],
            map: map,
            title: 'hello World',
            animation: google.maps.Animation.DROP
        });
    }
    var pointArray = new google.maps.MVCArray(list);
    var heatMap = new google.maps.visualization.HeatmapLayer({
        data : pointArray,
        radius: 40,
        maxIntensity: 5
    });
    heatMap.setMap(map);
}
//google.maps.event.addDomListener(window, 'load', initialize);