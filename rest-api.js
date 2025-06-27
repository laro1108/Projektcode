import express from 'express';
import sqlite3 from 'sqlite3';
sqlite3.verbose();
import fs from 'fs';

// SQLite-Datenbankverbindung herstellen
const db = new sqlite3.Database('./data/Highchart_sql.sqlite');












// Datenbanktabelle erstellen (falls sie noch nicht existiert)
db.run(`CREATE TABLE IF NOT EXISTS Locations (
    id INTEGER PRIMARY KEY,
    name TEXT,
    longitude REAL,
    latitude REAL,
    description TEXT,
    type TEXT
    )`);


// Weitere DB wurde in Datei "Tabelleninhalt_KH" erstellt und wird hier über eine Funktion eingeladen
//import createTable from './Tabelleninhalt_KH.js';
//createTable(DatenKH);

// Router erstellen für REST-Anfragen auf '/locations'
const restApi = express.Router();

// RESTful API Endpunkt, um alle Locations zu löschen
restApi.delete('/', (req, res) => {
  console.log('[rest-api.js/delete] Datenbank wird gelöscht');
  db.run('DELETE FROM Locations', (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: 'Löschen aller Locations erfolgreich' });
    }
  });
});

// RESTful API Endpunkt, um bestimmte Location mit id zu löschen
restApi.delete('/:id', (req, res) => {
  console.log(`[rest-api.js/delete] Eintrag ${id} wird gelöscht`);
  const id = req.params.id;
  db.run('DELETE FROM Locations WHERE id=?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: `Löschen von ${id} erfolgreich` });
    }
  });
});

// RESTful API Endpunkt, um Locations zu lesen
restApi.get('/', (req, res) => {
  const q = req.query;
  console.log('Query:', q);
  if (q && 'search' in q) {
    // Suche mit bestimmten Suchbegriff über Name und Beschreibung
    console.log('[rest-api.js/get] Suche Locations mit Suchstring:', q.search);
    db.all('SELECT * FROM Locations WHERE ' +
      'name LIKE ? OR description LIKE ?', [
      `%${q.search}%`, `%${q.search}%`
    ], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        console.log('[rest-api.js/get] Locations gelesen:', rows.length);
        res.json(rows);
      }
    });
    // Lösung Start 
  } else if (q && 'searchName' in q &&
    'searchDescription' in q) {
    console.log('[rest-api.js/get] Suche Locations mit Namen:', q.searchName,
      'Beschreibung:', q.searchDescription);
    db.all('SELECT * FROM Locations WHERE ' +
      'name LIKE ? AND description LIKE ?', [
      `%${q.searchName}%`, `%${q.searchDescription}%`
    ], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        console.log('[rest-api.js/get] Locations gelesen:', rows.length);
        res.json(rows);
      }
    });
    // Lösung Ende
  } else {
    // Gebe alle Locations zurück
    db.all('SELECT * FROM Locations', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        console.log('[rest-api.js/get] Alle Locations gelesen:', rows.length);
        res.json(rows);
      }
    });
  }
});

// RESTful API Endpunkt, um neue Location hinzuzufügen
restApi.post('/', (req, res) => {
  const poi = req.body;
  console.log('[rest-api.js/post] Neuer POI wird hinzugefügt:', poi);

  // Überprüfen, ob alle erforderlichen Daten vorhanden sind
  if (!poi.name || !poi.longitude || !poi.latitude || !poi.description
    || !poi.type) {
    res.status(400).json({ error: 'Fehlende Daten' });
  }

  // Eintrag hinzufügen
  db.run('INSERT INTO Locations (name, longitude, latitude, ' +
    'description, type) VALUES (?, ?, ?, ?, ?)', [
    poi.name, poi.longitude, poi.latitude,
    poi.description, poi.type
  ], (err) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json({ message: `Hinzufügen von '${poi.name}' erfolgreich` });
    }
  });
});

// RESTful API Endpunkt, um existierende Location zu ändern
restApi.put('/:id', (req, res) => {
  const poi = req.body;
  console.log('[rest-api.js/put] Existierender POI wird geändert:', poi);

  // Überprüfen, ob alle erforderlichen Daten vorhanden sind
  if (!poi.name || !poi.longitude || !poi.latitude || !poi.description
    || !poi.type) {
    res.status(400).json({ error: 'Fehlende Daten' });
  }

  // Eintrag ändern
  db.run('UPDATE locations SET name=?, longitude=?, latitude=?, description=?, type=? WHERE id=?',
    [poi.name, poi.longitude, poi.latitude, poi.description, poi.type, poi.id], (err) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json({ message: `Ändern von '${poi.id}' erfolgreich` });
      }
    });
});

// RESTful API Endpunkt, um Datenbank zurückzusetzen und mit Beispieldaten
// zu befüllen
restApi.get('/reset', (req, res) => {
  console.log('[rest-api.js/reset] Datenbank wird zurückgesetzt');

  // Lese lokale JSON-Datei als String und parse zum JS-Objekt
  const jsonFile = './public/locations.json';
  const data = fs.readFileSync(jsonFile, 'utf8');
  const locations = JSON.parse(data);

  // Serialisiere die folgenden Schritte
  db.serialize(() => {
    // Lösche Datenbank-Tabelle
    db.run('DELETE FROM Locations');

    // Bereite das Einfügen von Daten vor
    const query = 'INSERT INTO Locations (name, longitude, latitude, description, type) VALUES (?, ?, ?, ?, ?)';
    let insertStmt = db.prepare(query);

    // Iteriere durch die JSON-Daten und füge sie in die Datenbank ein
    locations.forEach(poi => {
      insertStmt.run([poi.name, poi.longitude, poi.latitude, poi.description, poi.type]);
    });

    // Schließe die vorbereitete Anweisung
    insertStmt.finalize();

    // Gebe zurückgesetzte Daten der DB zurück
    db.all('SELECT * FROM Locations', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json(rows);
      }
    });
  });
});

export default restApi;