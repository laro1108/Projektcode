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

  var aerzteLayerPuffer = L.tileLayer.wms('http://localhost:8080/geoserver/webseite/wms', {
    layers: 'webseite:puffer_ärzte',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  // Standard-Layer anzeigen
  boundaryLayer.addTo(map);

  const layerMap = {
    krankenhaus: krankenhausLayer,
    krankenhausPuffer: krankenhausLayerPuffer,
    apotheken: apothekenLayer,
    apothekenPuffer: apothekenLayerPuffer,
    aerzte: aerzteLayer,
    aerztePuffer: aerzteLayerPuffer
  };

  // Hilfe con chatgpt
  document.querySelectorAll('#layer-panel input[type="checkbox"]').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      const layerName = this.dataset.layer;
      const layer = layerMap[layerName]; // Holt das passende Layer-Objekt

      if (!layer) return;

      if (this.checked) {
        layer.addTo(map);
      } else {
        map.removeLayer(layer);
      }
    });
  });

  // Nur Toggle-Button öffnet/schließt das Menü
  const toggleButton = document.getElementById("toggle-button");
  const layerToggle = document.getElementById("layer-toggle");
  const layerPanel = document.getElementById("layer-panel");

  toggleButton.addEventListener("click", function (e) {
    e.stopPropagation(); // verhindert ungewollte Events
    layerToggle.classList.toggle("open");
  });

  // Klicks im Panel selbst sollen das Menü nicht schließen
  layerPanel.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});
