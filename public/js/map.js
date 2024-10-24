  let coordinates = listing.locationCoords.coordinates;
  let title = listing.title;
  
  // Initialize the map
  var map = L.map('map').setView([coordinates[1], coordinates[0]], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

console.log(coordinates);
// Add a marker at the location
L.marker([coordinates[1], coordinates[0]]).addTo(map)
    .bindPopup(title)
    .openPopup();