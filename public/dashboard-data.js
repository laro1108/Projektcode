// Setze globale Variablen 
var poiList = [];
var userLongitude = 0.0;
var userLatitude = 0.0;

// Bestimmen der aktuellen Position und abspeichern nach userLongitude und userLatitude
function getUserCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('[getUserLocation] Position des Nutzers:', position.coords);
      userLongitude = position.coords.longitude;
      userLatitude = position.coords.latitude;
      document.getElementById('userCoordinates').innerHTML = "(" +
        userLongitude + ", " + userLatitude + ")";
    }, error => {
      if (error.code === error.POSITION_UNAVAILABLE) {
        console.warn('Position unbekannt, versuche es später erneut.');
      } else {
        console.error('Geolocation-Fehler:', error.message);
      }
    });
  }
}

// Toggle-Button Klick Für Chart verantwortlich
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleChartButton');
  const chartContainer = document.getElementById('chartContainer');
  const closeButton = document.getElementById('closeChartButton');
  const fachabteilungSelect = document.getElementById('fachabteilungSelect') // hier gegenchecken, ob benötigt

  document.getElementById('fachabteilungSelect').addEventListener('change', function () {
    const selectedFach = this.value;
    initChart(selectedFach);
  });

  // Chart über Button zu Öffnen, aber auch wieder zu schließen zwecks Intuitivität
  function closeChart() {
    chartContainer.style.display = 'none';
    toggleButton.innerText = 'Diagramm'; // zurücksetzen
  }

  toggleButton.addEventListener('click', () => {
    if (chartContainer.style.display === 'block') {
      closeChart();
    } else {
      chartContainer.style.display = 'block';

      const selectedFach = document.getElementById('fachabteilungSelect').value;
      initChart(selectedFach);

      toggleButton.innerText = 'Diagramm';
    }
  });
  closeButton.addEventListener('click', () => {
    closeChart();
  });
});

// Daten für Chart anpassen 
function initChart(fachabteilung = 'insg') {
  fetch(`/Highchart_sql/betten?fachabteilung=${encodeURIComponent(fachabteilung)}`)
    .then(response => response.json())
    .then(data => {
      console.log('Empfangene Daten:', data);

      const categories = data.map(row => row.stadt);
      const values = data.map(row => Number(row.betten));

      Highcharts.chart('chart-inner-container', {
        chart: { type: 'column' },
        title: { text: `Krankenhausbetten (${fachabteilung})` },
        xAxis: {
          categories: categories,
          title: { text: 'Stadt' },
          labels: {
            rotation: -65,
            style: { fontSize: '12px' },
            step: 1,
            allowOverlap: true,
            overflow: 'justify'
          }
        },
        yAxis: {
          min: 0,
          title: { text: 'Anzahl Betten' }
        },
        series: [{
          name: 'Betten',
          data: values
        }]
      });
    })
    .catch(err => console.error('Fehler beim Abrufen der Daten:', err));
}
// Checkbox-Logik für Layer-Schalter - Hilfe von ChatGPT
document.querySelectorAll('#layer-panel input[type="checkbox"]').forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    const layerName = this.dataset.layer;
    const layer = layerMap[layerName];
    if (!layer) return;

    if (this.checked) {
      layer.addTo(map);
    } else {
      map.removeLayer(layer);
    }
  });
});
// Layer-Schalter-Panel öffnen/schließen
document.getElementById('toggleLayerButton').addEventListener('click', function () {
  const layerToggle = document.getElementById('layer-toggle');
  const layerPanel = document.getElementById('layer-panel');
  layerToggle.classList.toggle('open');

  if (layerToggle.classList.contains('open')) {
    layerPanel.style.display = 'block';
  } else {
    layerPanel.style.display = 'none';
  }
});