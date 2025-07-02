// WFS URLs
const wfsUrls = [
  "http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=cite:aerzte_puffer_wfs&outputFormat=application/json",
  "http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=cite:apotheke_puffer_wfs&outputFormat=application/json",
  "http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=cite:krankenhaus_puffer_wfs&outputFormat=application/json"
];

// Aliase für Layernamen
const layerAliases = {
  1: "Krankenhäuser",
  2: "Ärzte",
  3: "Apotheken"
};

let qualityCheckActive = false;

document.addEventListener("DOMContentLoaded", function () {
  if (typeof map === "undefined") {
    console.error("Die Leaflet-Karte 'map' ist noch nicht definiert.");
    return;
  }

  const toggleBtn = document.getElementById("qualityToggleBtn");
  if (!toggleBtn) {
    console.error("Toggle-Button nicht gefunden!");
    return;
  }

  toggleBtn.addEventListener("click", function () {
    qualityCheckActive = !qualityCheckActive;
    toggleBtn.classList.toggle("active", qualityCheckActive);
  });

  map.on("click", function (e) {
    if (!qualityCheckActive) return;

    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const delta = 0.0005;
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

    Promise.all(wfsUrls.map((url, index) => {
      const fullUrl = url + `&bbox=${bbox},EPSG:4326`;
      return fetch(fullUrl)
        .then(resp => resp.json())
        .then(data => {
          const feature = data.features[0];
          return {
            layer: layerAliases[index + 1] || `Layer ${index + 1}`,
            quality: feature ? feature.properties.quality : 4 // 4 als Default wenn keine Daten
          };
        })
        .catch(() => ({
          layer: layerAliases[index + 1] || `Layer ${index + 1}`,
          quality: 4
        }));
    })).then(results => {
      const categories = results.map(r => r.layer);
      const values = results.map(r => typeof r.quality === 'number' ? r.quality : 0);

      const chartContainer = document.createElement("div");
      chartContainer.style.width = "300px";
      chartContainer.style.height = "200px";

      L.popup()
        .setLatLng(e.latlng)
        .setContent(chartContainer)
        .openOn(map);

      Highcharts.chart(chartContainer, {
        chart: { type: 'column', backgroundColor: 'transparent' },
        title: { text: 'Qualitätswerte' },
        xAxis: { categories },
        yAxis: { min: 0, title: { text: 'Wert' } },
        series: [{ name: 'Qualität', data: values, colorByPoint: true }],
        credits: { enabled: false },
        legend: { enabled: false }
      });
    });
  });
});
