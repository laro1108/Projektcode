// API Suchmaschine für Krankenhäuser
import express from 'express';

const router = express.Router(); // ✅ nur einen Router erzeugen

router.get('/', async (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'Keine Suchanfrage angegeben' });
  }

  try {
    const response = await fetch('https://klinikatlas.api.proxy.bund.dev/fileadmin/json/locations.json');

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der API: ${response.status}`);
    }

    const data = await response.json();

    const isInHessen = (lat, lon) => {
      return (
        lat >= 49.948229196 && lat <= 51.6540496066 &&
        lon >= 7.7731704009 && lon <= 10.2340156149
      );
    };

    const filtered = data.filter(item => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const specializationMatch = item.specializations?.some(s => s.toLowerCase().includes(query));

      const lat = parseFloat(item.latitude);
      const lon = parseFloat(item.longitude);

      return (nameMatch || specializationMatch) && isInHessen(lat, lon);
    });

    res.json(filtered);

  } catch (err) {
    console.error('API-Fehler:', err.message);
    res.status(500).json({ error: 'Fehler beim Abrufen der Klinikdaten' });
  }
});

export default router;
