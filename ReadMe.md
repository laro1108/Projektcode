# Express Webserver mit der POI App

Dieses Packet enthält den Rahmen für die Entwicklung des Web-Servers. Dieser nutzt Express.js (https://expressjs.com/de/) als Webserver und SQLite
(https://www.sqlite.org/) als Datenbank. Für das Erstellen und den Zugriff auf die Datenbank nutzen wir das Node-Module sqlite3 (https://www.sqlitetutorial.net/sqlite-nodejs/).


## Inhalte des Verzeichnisses
- `package.json`: Konfiguration der Anwendung
  - Node-Module, die für den Betrieb benötigt werden
  - Node-Module, die für die Entwicklung benötigt werden
- `server.js`: Die Startdatei des Webservers, welcher eine REST-Schnittstelle zur Verfügung stellt, um Locations zu laden und neue hinzuzufügen sowie HTML, CSS, JS und Bilder zur Verfügung zu stellen
- `locations.db`: SQLite-Datenbank, welche Positionsdaten enthält
- `rest-api.js`: Regelt die REST-API-Aufrufe an den Server
- `public`: Verzeichnis mit öffentlichen Dateien, welche der Webserver allen Clients zur Verfügung stellt
  - Hier werden auch alle Web-Apps abgelegt, die der Server anbieten soll
  - Des Weiteren können wir hier HTML, CSS, JS, Bilder, JSON, etc. ablegen, die von Clients zugegriffen werden sollen
  - `poi-app`: Unsere kleine Beispiel-App für Points of Interests (POI)
    - `index.html`: Die Startdatei mit dem HTML der App
    - `dashboard-data.js`: Der JavaScript-Code für das Laden/Schreiben von Daten
    - `dashboard-leaflet.js`: Der JavaScript-Code für das Anzeigen der Karte und von Markern
    - `dashboard-styles.css`: Die CSS-Datei für die Formatierung der App
    - `locations.json`: Beispiel-POI-Daten im JSON-Format


## Aufsetzen des Projektes

Damit man die Node-Module und Umgebung nicht komplett von Hand aufsetzen muss, kann man mit `npm` auch die Anwendung steuern:
- `npm install`: Installiert alle Node-Module aus `package.json`
- `npm run start`: Startet den Webserver und öffnet automatisch ein Browserfenster mit den Inhalten
- `npm run dev`: Startet den Webserver mit nodemon für die Entwicklung, d.h., wenn sich Dateien ändern, dann wird der Server automatisch neu gestartet
- `npm run devOpen`: Wie `npm run dev` plus dass zusätzlich die Startseite des Servers automatisch im Browser geöffnet wird

**Hinweis:** `npm` muss im Wurzelverzeichnis der Anwendung ausgeführt werden! (Dort wo `package.json` liegt.)

Jens Heidrich, 25.3.2025