const status = document.getElementById('status');
const locateBtn = document.getElementById('locateBtn');
let map, marker;

function initMap(lat = 20, lng = 0) {
  if (!map) {
    map = L.map('map').setView([lat, lng], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  } else {
    map.setView([lat, lng], 15);
  }
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map)
      .bindPopup('Your current location')
      .openPopup();
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

setInterval(() => {
  status.textContent = 'Auto-refreshing location...';
  getLocation();
}, 10000);
