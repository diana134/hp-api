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
import * as sql from './sql.js';
const db = new sqlite3.Database('./data.db');

// Read in the character data
import * as fs from 'fs';
const character_data = JSON.parse(fs.readFileSync('./briv.json'))

try {
  await sql.initialize(db);

  // Insert character data into database
  await sql.new_character(db, character_data);

  for (const i in character_data['classes']) {
    const class_data = character_data['classes'][0];
    await sql.new_class(db, class_data);
    await sql.assign_class(db, character_data['name'], class_data['name'], class_data['level'])
  }

  for (const i in character_data['items']) {
    const item_data = character_data['items'][0];
    await sql.new_item(db, item_data);
    await sql.assign_item(db, character_data['name'], item_data['name']);
  }

  for (const i in character_data['defenses']) {
    const defense_data = character_data['defenses'][0];
    await sql.new_defense(db, defense_data);
    await sql.assign_defense(db, character_data['name'], defense_data['type']);
  }
} catch (error) {
  console.log(error);
}
