let map;

// Function that styles the boxes given their last voltage
function boxStyle(pond_id, do_value) {
  var mediumDO = 60;
  var lowDO = 40;
  let color = 'gray';

    if (do_value<=lowDO){
      color = 'red';
    }

    else if(do_value>lowDO & do_value<=mediumDO){
      color = 'orange';
    }

    else if(do_value>mediumDO){
      color = "green";
    }

    return color;
  }
  
// Function that initializes the map
function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), 
  {
    zoom: 16,
    center: { lat: 37.7037823, lng: -89.4648105 },
    mapTypeId: 'satellite',
    mapTypeControl: false,
    streetViewControl: false
  });

  // Load GeoJSON.
  map.data.addGeoJson(geoFile_HAUCS);

  // Call style function
  map.data.setStyle((feature) => {
    let pond_id = feature.getProperty('number');
    let do_value = do_HAUCS[pond_id]

    color = boxStyle(pond_id, do_value)
   
    return /** @type {!google.maps.Data.StyleOptions} */ {
      fillColor: color,
      strokeColor: color,
      strokeWeight: 2,
    };
  });

  // Static aerators locations
  var marker_locations = [
    [ 37.7037823, -89.4648105],
    [ 37.703000518448896, -89.4688201254245]
  ];

  var infowindow = new google.maps.InfoWindow();

  // Initialize status and icon variables
  var status="on"; //will be a data point sent eventually
  var marker_icon = '';

  // Function that creates custom markers given locations
  function createMarkers(status, marker_locations, marker_icon){
    
    for(let i=0; i<marker_locations.length; i++){
      if (status=='on'){
        marker_icon = "static/images/aerator_on.svg";
      }
      else{
        marker_icon = "static/images/aerator_off.svg";
      }
      
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(marker_locations[i][0], marker_locations[i][1]),
        map: map,
        icon: {
          url: marker_icon,
          scaledSize: new google.maps.Size(25,25)
        }
      });
      
      google.maps.event.addListener(marker, 'click', (function(marker, i){
        return function() {
          infowindow.setContent("Status: "+ status)
          infowindow.open(map, marker);
        }
      })(marker, i));
    }
  }

  // Call markers function
  map_markers = createMarkers(status, marker_locations, marker_icon)

  // Add listeners for user interaction
  map.data.addListener("click", (event) => {
    location.href = "/pond"+event.feature.getProperty("number");
  });

  map.data.addListener("mouseover", (event) => {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature, { strokeWeight: 5 });
  });

  map.data.addListener("mouseout", (event) => {
    map.data.revertStyle();
  });

  }

window.initMap = initMap;