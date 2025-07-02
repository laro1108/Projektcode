import express from 'express';
import logger from 'morgan';
import restApi from './rest-api.js';
import searchApi from './api.js';

// Erzeuge Express-Objekt
const ex = express();

// Server soll mit JSON umgehen können
ex.use(express.json());

// Server verwendet einen Logger, um Ergebnisse von Requests anzuzeigen
ex.use(logger('dev'));

// Stellt alle Dateien unter public bereit
ex.use(express.static('public'));

// Stellt eine REST-API zur Verfügung, um auf die Datenbank
// zugreifen zu können
ex.use('/locations', restApi);

// Krankenhaussuche über API
ex.use('/api/search', searchApi);

// WFS
ex.use(express.static('public'));

// Setze den Port und erzeuge den Server
const port = 53000;
const server = ex.listen(port, () => {
  console.log(`[server.js] Express-Server läuft auf http://localhost:53000`);
});


