var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -25.363, lng: 131.044}
  });

  renderMarkers();

  map.addListener('click', function(e) {
    var lat = e.latLng.lat();
    var lng = e.latLng.lng();    
    var id = 'id_' + Date.now() + lat.toFixed(2) + lng.toFixed(2);
    generateMarker(lat, lng, id);    
  });  
}

function getMarkersFromLocalStorage() {
  return localStorage.markers ? JSON.parse(localStorage.markers) : {};
};

function addMarkerToLocalStorage(lat, lng, id, customProps) {
  var markers = getMarkersFromLocalStorage();
  markers[id] = {
    lat: lat, 
    lng: lng
  };

  if(customProps && Object.keys(customProps).length) {
    for(prop in customProps) {
      markers[id][prop] = customProps[prop];
    }
  }

  localStorage.markers = JSON.stringify(markers);
};

function removeMarkerFromLocalStorage(id) {
  // console.log('removeMarkerFromLocalStorage');
  var markers = getMarkersFromLocalStorage();
  delete markers[id];
  localStorage.markers = JSON.stringify(markers);
};

function renderMarkers() {
  var markers = getMarkersFromLocalStorage();  

  for(id in markers) {
    let customProps = {};

    if(markers[id].baloon_text) { customProps.baloon_text = markers[id].baloon_text; }
    if(markers[id].hint_text) { customProps.hint_text = markers[id].hint_text; }
    if(markers[id].baloon_close_icon) { customProps.baloon_close_icon = markers[id].baloon_close_icon; }

    generateMarker(markers[id].lat, markers[id].lng, id, customProps);
  };
};

function generateMarker(lat, lng, id, customProps) {  
  var marker = new google.maps.Marker({
    position: {lat: lat, lng: lng},
    map: map,
    title: (customProps && customProps.hint_text) ? customProps.hint_text : undefined
  }); 
  marker.id = id;

  // console.log(lat, lng, id, customProps, marker.id);

  if(customProps && Object.keys(customProps).length) {
    for(id in customProps) {
      marker.id[id] = customProps[id];
    }
  }

  addMarkerToLocalStorage(lat, lng, id, customProps);

  if(customProps && customProps.baloon_text) {
    var infowindow = new google.maps.InfoWindow({
      content: customProps.baloon_text
    });  

    marker.addListener('click', function(e) {
      infowindow.open(map, marker);
    });    
  }

  marker.addListener('rightclick', function(e) {
    $('#myModal').modal('show');
    document.getElementById('myModal').setAttribute('data-point-id', this.id);

    var markers = getMarkersFromLocalStorage();

    document.getElementById('baloonText').value = markers[id].baloon_text ? markers[id].baloon_text : '';            
    document.getElementById('hintText').value = markers[id].hint_text ? markers[id].hint_text : '';            
    document.getElementById('closeBtn').value = markers[id].baloon_close_icon ? markers[id].baloon_close_icon : '';        
  });   

};

function setPointProps() {
    var id = document.getElementById('myModal').getAttribute('data-point-id'),
        baloonText = document.getElementById('baloonText').value,
        hintText = document.getElementById('hintText').value,
        baloon_close_icon = document.getElementById('closeBtn').value;

    // console.log('setPointProps', id, baloonText, hintText, baloon_close_icon);

    var markers = getMarkersFromLocalStorage();
    markers[id].baloon_text = baloonText;
    markers[id].hint_text = hintText;
    markers[id].baloon_close_icon = baloon_close_icon;
    localStorage.markers = JSON.stringify(markers);

    renderMarkers();

    $('#myModal').modal('hide');
};




