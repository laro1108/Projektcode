document.addEventListener('DOMContentLoaded', function () {
  // Karte erstellen
  var map = L.map('myMap').setView([50, 9], 6);

  // Hintergrundkarte (optional)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Layer definieren 
  var hborisZonenLayer = L.tileLayer.wms('https://www.gds-srv.hessen.de/cgi-bin/lika-services/ogc-free-maps.ows?', {
    layers: 'hboris_zonen_t',
    format: 'image/png',
    transparent: true, // wichtig!
    version: '1.3.0',
    attribution: 'Datenquelle: Hessische Verwaltung hboris'
  });


  var krankenhausLayer = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms', {
    layers: 'cite:Krankenhaeuser_punkte_utm',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var krankenhausLayerPuffer = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms', {
    layers: 'cite:krankenhaus_puffer',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var apothekenLayer = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms', {
    layers: 'cite:apotheke_punkte_utm',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var apothekenLayerPuffer = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms', {
    layers: 'cite:puffer_apotheken',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var aerzteLayer = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms', {
    layers: 'cite:aerzte_punkte_utm',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  var aerzteLayerPuffer = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms', {
    layers: 'cite:puffer_aerzte',
    format: 'image/png',
    transparent: true,
    attribution: 'Daten: GeoServer'
  });

  // Standard-Layer anzeigen
  const layerMap = {
    krankenhausLayer: krankenhausLayer,
    krankenhausLayerPuffer: krankenhausLayerPuffer,
    apothekenLayer: apothekenLayer,
    apothekenLayerPuffer: apothekenLayerPuffer,
    aerzteLayer: aerzteLayer,
    aerzteLayerPuffer: aerzteLayerPuffer,
    hborisZonenLayer: hborisZonenLayer
  };

  // Hilfe von chatgpt
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
