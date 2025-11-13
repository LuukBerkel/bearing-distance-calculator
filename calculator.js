const map = L.map('map').setView([52.1326, 5.2913], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let points = [];
let markers = [];
let polyline = L.polyline([], { color: 'blue', weight: 4 }).addTo(map);

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; 
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lng2 - lng1);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function getBearing(lat1, lng1, lat2, lng2) {
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δλ = toRadians(lng2 - lng1);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);

    return (toDegrees(θ) + 360) % 360;
}

function addPoint(point) {
    const { lat, lng } = point.latlng;

    const marker = L.marker([lat, lng]).addTo(map);
    markers.push(marker);

    if (markers.length > 1) {
        const [prevLat, prevLng] = points[points.length - 1];
        const distance = getDistance(prevLat, prevLng, lat, lng).toFixed(2);
        const bearing = getBearing(prevLat, prevLng, lat, lng).toFixed(2);
        document.getElementById('list').innerHTML +=
            `<div class="list">Bearing: ${bearing}°, Distance: ${distance} m</div>`;
    }

    points.push([lat, lng]);
    polyline.setLatLngs(points);
}

function removePoint() {
    if (markers.length === 0) return;
    var hasTwoMarkers = markers.length === 2 ? true : false;
    var hasOneMarker =  markers.length === 1 ? true : false;


    const lastMarker = markers.pop();
    map.removeLayer(lastMarker);
    if (hasTwoMarkers) {
        const lastMarker = markers.pop();
        map.removeLayer(lastMarker);
    }

    if (!hasOneMarker){
        const list = document.getElementById('list');
        list.removeChild(list.lastElementChild); 
    }

    points.pop();
    if (hasTwoMarkers) {
        points.pop();
    }
    polyline.setLatLngs(points);
}

