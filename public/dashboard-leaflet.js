document.addEventListener('DOMContentLoaded', function () {
  // Karte erstellen
  var map = L.map('myMap').setView([50, 9], 6);

  // Hintergrundkarte (optional)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Layer definieren (aber noch nicht hinzufügen)
  var boundaryLayer = L.tileLayer.wms('http://localhost:8080/geoserver/ne/wms', {
    layers: 'ne:boundary_lines',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var krankenhausLayer = L.tileLayer.wms('http://localhost:8080/geoserver/webseite/wms', {
    layers: 'webseite:Krankenhaeuser_punkte_utm',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var krankenhausLayerPuffer = L.tileLayer.wms('http://localhost:8080/geoserver/webseite/wms', {
    layers: 'webseite:krankenhaus_puffer',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var apothekenLayer = L.tileLayer.wms('http://localhost:8080/geoserver/webseite/wms', {
    layers: 'webseite:apotheke_punkte_utm',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var apothekenLayerPuffer = L.tileLayer.wms('http://localhost:8080/geoserver/webseite/wms', {
    layers: 'webseite:puffer_apotheken',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var aerzteLayer = L.tileLayer.wms('http://localhost:8080/geoserver/webseite/wms', {
    layers: 'webseite:ärzte_punkte_utm',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var aerzteLayerPuffer  = L.tileLayer.wms('http://localhost:8080/geoserver/webseite/wms', {
    layers: 'webseite:puffer_ärzte',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  // Standard-Layer anzeigen
  boundaryLayer.addTo(map);

  // Checkbox-Logik für Layer-Schalter - Hilfe von ChatGPT
  document.querySelectorAll('#layer-panel input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      var layerName = this.dataset.layer;

      if (layerName === 'layer1') {
        if (this.checked) {
          krankenhausLayer.addTo(map);
        } else {
          map.removeLayer(krankenhausLayer);
        }
      }
    });
  });

  // Layer-Schalter-Panel öffnen/schließen
  document.getElementById('layer-toggle').addEventListener('click', function () {
    this.classList.toggle('open');
  });
});
