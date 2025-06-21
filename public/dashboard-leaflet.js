document.addEventListener('DOMContentLoaded', function () {
  // Karte erstellen
  var map = L.map('myMap').setView([50, 9], 6);

  // Hintergrundkarte (optional)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // WMS-Layer vom GeoServer hinzufügen
  L.tileLayer.wms('http://localhost:8080/geoserver/ne/wms', {
    layers: 'ne:boundary_lines',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  }).addTo(map);
});

//Geoserver einbinden, hier nur Platzhalter, damit man schauen kann, ob die Webseite klappt

// Für Layer verantwortlich, aktuell Platzhalter
//Baselayer einbinden

// Overlays wms vom geoserver
L.tileLayer.wms('http://localhost:8080/geoserver/webseite/1km_krankenhaus', {
  layers: 'workspace:webseite',
  format: 'image/png',
  transparent: true
  }).addTo(map);
L.tileLayer.wms('http://localhost:geoserver/speicherort', {
  layers: 'workspace:Beispiel',
  format: 'image/png',
  transparent: true
});
const Layername3 = L.tileLayer.wms('http://geoserver:8080/geoserver/speicherort', {
  layers: 'workspace:Beispiel',
  format: 'image/png',
  transparent: true
});


