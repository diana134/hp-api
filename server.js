import express from 'express';

const port = 3000;
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Receive commands to do damage or heal
// want: character, damage type, damage amount
// healing is negative damage?

// Initialize the database
import sqlite3 from 'sqlite3';
import { initialize } from './sql.js';
const db = new sqlite3.Database('./data.db');
try {
  await initialize(db);
} catch (error) {
  console.log(error);
} finally {
  db.close();
}

// Read in the character data
import * as fs from 'fs';
const character_data = JSON.parse(fs.readFileSync('./briv.json'))


// Read character data into database

