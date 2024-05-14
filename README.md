# IM4 Project-G

## Personenvorstellung / Arbeitsverteilung

Das Projekt wird von einem Team von drei Entwicklern geleitet:

- Jasper Bleeker / Backend, Einrichtung Datenbanken, Frontend, Hauptverantortlicher Charts und Maps
- Joel Hutter / UX/UI, Frontend, Unterstützung Charts und Maps, Dokumentation, Präsentation
- Yuri Fontanive / UX/UI, Hauptverantwortlicher Frontend

## Projektzusammenfassung
Der Kerninhalt der Page ist die grafische Darstellung der Auslastung von Parkhäusern zu gewissen Tageszeiten über 24h, verteilt im Raum Stadt Zürich. Wir nutzen dafür die API von der Seite "parkend.de", die stündlich die aktuellen Auslastungsdaten aktualisiert. So wird auch unsere Datenbank stündlich aktualisiert und entsprechend können diese Daten auch genutzt werden. Wir arbeiten mit einer Map, die als Dotchart interagiert und die genauen Standorte unserer Parkplätze/Parkhäuser anzeigt. Zusätzlich wird durch die Grösse der Dots die Auslastung in Prozent dargestellt. Durch einen Datepicker und Slidebar, zum Anzeigen jeder Stunde, können die Daten abgerufen werden. Zusätzlich wird die prozentuale Auslastung der Parkhäuser über eine Line-Chart visualisiert. Somit kann über einen selbst definierbaren Zeitraum die Auslastung aller Parkplätze/Parkhäuser miteinander verglichen werden.

## Learnings
php:
- Struktur und Verbindung der Datenbanken und API (Extract, Load, Transform, Unload).
Chart.js:
- ansprechende visuelle Darstellungsmöglichkeiten -> wenns funktioniert
Leaflet:
- mit bereits ähnlichen Schema, viel von Chart.js übernommen und so einfach darzustellen
Verlinkung API:
- API abrufen, rohe Daten anzeigen, via php einbauen
Server Aktivitäten (Verbindung mit VS-Code, Liveanzeige):
- GitHub Repetition, ftp-simple

## Schwierigkeiten
Verbindung API und php:
- ?
chart.js:
- Pain
- Map von leaflet besser als Koordinatendaten als Dot-Chart und Map als Hintergrundbild
GitHub:
- kleine Pullprobleme
Index.html:
- Gross und Kleinschreibung beachten!

## benutzte Ressourcen
- VS-Code und Plugins (FTP-simple, Copilot)
- GitHub
- ChatGPT
- chart.js
- leaflet
- API “parkendd.de”
