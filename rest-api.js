import express from 'express';
import sqlite3 from 'sqlite3';

const router = express.Router();

// Öffne die Datenbank
const db = new sqlite3.Database('./public/data/Highchart_sql.sqlite');


// GET /locations/betten?fachabteilung=INSG
router.get('/betten', (req, res) => {
  const fach = req.query.fachabteilung || 'insg';
  const sql = `SELECT standort AS stadt, [${fach}] AS betten FROM khverzeichnis_highchart WHERE [${fach}] IS NOT NULL`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('[API] DB-Fehler:', err);
      res.status(500).json({ error: 'Fehler beim Lesen der Datenbank' });
    } else {
      console.log('[API] Ergebnis:', rows);
      res.json(rows);
    }
  });
});

export default router;
