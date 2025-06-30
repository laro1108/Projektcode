    async function performSearch() {
      const input = document.getElementById('searchInput').value;
      const resultElement = document.getElementById('searchResults');

      resultElement.innerHTML = '<p>Lade Ergebnisse...</p>';

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(input)}`);
        if (!response.ok) {
          throw new Error('Fehler bei der Suche');
        }

        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
          // Zeige max. 5 Ergebnisse schön formatiert
          const htmlResults = data.slice(0, 5).map(item => {
            const name = item.name || 'Kein Name';
            const address = item.street
              ? `${item.street}, ${item.zip} ${item.city}`
              : 'Keine Adresse verfügbar';

            return `
              <div class="resultItem"
              onclick="zoomTo(${item.latitude}, ${item.longitude}, '${name.replace(/'/g, "\\'")}')">
              <strong>${name}</strong><br />
              <small>${address}</small>
              </div>
             `;
          }).join('');


          resultElement.innerHTML = htmlResults;
        } else {
          resultElement.innerHTML = '<p>Keine Ergebnisse gefunden.</p>';
        }

      } catch (err) {
        resultElement.innerHTML = `<p>Fehler: ${err.message}</p>`;
      }
    }