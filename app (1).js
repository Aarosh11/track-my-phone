mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Replace with your real token

const status = document.getElementById('status');
const locateBtn = document.getElementById('locateBtn');
let map, marker;

function initMap(lat = 20, lng = 0) {
  if (!map) {
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: 15,
      pitch: 60,
      bearing: -60,
      antialias: true
    });

    map.on('load', () => {
      map.addSource('mapbox-dem', {
        "type": "raster-dem",
        "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
        "tileSize": 512,
        "maxzoom": 14
      });
      map.setTerrain({ "source": "mapbox-dem", "exaggeration": 1.5 });
      map.addControl(new mapboxgl.NavigationControl());
    });

    marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setText("Your current location"))
      .addTo(map);
  } else {
    map.flyTo({ center: [lng, lat], zoom: 15 });
    marker.setLngLat([lng, lat]);
  }
}

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  status.textContent = `Latitude: ${latitude.toFixed(5)}, Longitude: ${longitude.toFixed(5)}`;
  initMap(latitude, longitude);
}

function error(err) {
  status.textContent = `Error: ${err.message}`;
}

function getLocation() {
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser.';
    return;
  }
  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });
}

locateBtn.addEventListener('click', () => {
  status.textContent = 'Getting location...';
  getLocation();
});

getLocation();
