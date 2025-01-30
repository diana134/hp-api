import express from 'express';
import bodyParser from 'body-parser';
import * as hp from './hp_logic.js';

const port = 3000;
const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/characters/:id', async (req, res) => {
  const character_id = req.params.id;
  try {
    const character = await sql.get_character(db, character_id);
    if (!character) {
      res.status(404).json({error: 'Character not found'});
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({error: 'Bad request'});
  }
});

app.patch('/damage/:id', async (req, res) => {
  try {
    const character_id = req.params.id;
    const damage_type = req.body.damage_type;
    const damage_value = req.body.damage_value;
    const character = await hp.apply_damage(db, character_id, damage_type, damage_value);
    
    if (!character) {
      res.status(404).json({error: 'Character not found'});
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({error: 'Bad request'});
  }
});

app.patch('/heal/:id', async (req, res) => {
  try {
    const character_id = req.params.id;
    const healing_value = req.body.healing_value;
    const character = await hp.apply_healing(db, character_id, healing_value);
    
    if (!character) {
      res.status(404).json({error: 'Character not found'});
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({error: 'Bad request'});
  }
});

app.patch('/temp_hp/:id', async (req, res) => {
  try {
    const character_id = req.params.id;
    const temp_hp = req.body.temp_hp;
    const character = await hp.apply_temp_hp(db, character_id, temp_hp);
    
    if (!character) {
      res.status(404).json({error: 'Character not found'});
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({error: 'Bad request'});
  }
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
import { error } from 'console';
const character_data = JSON.parse(fs.readFileSync('./briv.json'))

try {
  await sql.initialize(db);

  // Insert character data into database
  await sql.new_character(db, character_data);

  for (const i in character_data['classes']) {
    const class_data = character_data['classes'][i];
    await sql.new_class(db, class_data);
    await sql.assign_class(db, character_data['name'], class_data['name'], class_data['classLevel'])
  }

  for (const i in character_data['items']) {
    const item_data = character_data['items'][i];
    await sql.new_item(db, item_data);
    await sql.assign_item(db, character_data['name'], item_data['name']);
  }

  for (const i in character_data['defenses']) {
    const defense_data = character_data['defenses'][i];
    await sql.new_defense(db, defense_data);
    await sql.assign_defense(db, character_data['name'], defense_data['type'], defense_data['defense']);
  }
} catch (error) {
  console.log(error);
}
