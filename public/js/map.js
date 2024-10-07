  // Initialize the map
  var map = L.map('map').setView([28.6139, 77.2090], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);


  // Add a marker at the location
  L.marker([28.6139, 77.2090]).addTo(map)
      .bindPopup('<%= listing.title %>')
      .openPopup();