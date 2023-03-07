const fs = require('fs');

// Pfad zur Textdatei angeben
const filePath = process.argv[2];

// Dateiinhalt auslesen
const fileContent = fs.readFileSync(filePath, 'utf8');

// Text in ein Array von Zeilen aufteilen
const lines = fileContent.split('\n');
lines.pop();

// Array von Zeilen in ein Array von Zahlen umwandeln und die Summe berechnen
const sum = lines.reduce((acc, cur) => acc + parseInt(cur.trim()), 0);

// Durchschnitt berechnen
const avg = sum / lines.length;

console.log('Summe:', sum);
console.log('Durchschnitt:', avg);
