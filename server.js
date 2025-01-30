import express from "express";
import bodyParser from "body-parser";
import * as hp from "./hp_logic.js";
import { Database } from "./database.js";
import * as fs from "fs";

const port = 3000;
const app = express();
app.use(bodyParser.json({ type: "application/json" }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/characters/:id", async (req, res) => {
  const character_id = req.params.id;
  try {
    const character = await db.get_character(character_id);
    if (!character) {
      res.status(404).json({ error: "Character not found" });
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad request" });
  }
});

app.patch("/damage/:id", async (req, res) => {
  try {
    const character_id = req.params.id;
    const damage_type = req.body.damage_type;
    const damage_value = req.body.damage_value;
    const character = await hp.apply_damage(
      db,
      character_id,
      damage_type,
      damage_value,
    );

    if (!character) {
      res.status(404).json({ error: "Character not found" });
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad request" });
  }
});

app.patch("/heal/:id", async (req, res) => {
  try {
    const character_id = req.params.id;
    const healing_value = req.body.healing_value;
    const character = await hp.apply_healing(db, character_id, healing_value);

    if (!character) {
      res.status(404).json({ error: "Character not found" });
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad request" });
  }
});

app.patch("/temp_hp/:id", async (req, res) => {
  try {
    const character_id = req.params.id;
    const temp_hp = req.body.temp_hp;
    const character = await hp.apply_temp_hp(db, character_id, temp_hp);

    if (!character) {
      res.status(404).json({ error: "Character not found" });
    } else {
      res.json(character);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad request" });
  }
});

// Initialize the database
const db = new Database("./data.db");

// Read in the character data
const character_data = JSON.parse(fs.readFileSync("./briv.json"));

try {
  await db.initialize();

  // Insert character data into database
  await db.new_character(character_data);

  for (const i in character_data["classes"]) {
    const class_data = character_data["classes"][i];
    await db.new_class(class_data);
    await db.assign_class(
      character_data["name"],
      class_data["name"],
      class_data["classLevel"],
    );
  }

  for (const i in character_data["items"]) {
    const item_data = character_data["items"][i];
    await db.new_item(item_data);
    await db.assign_item(character_data["name"], item_data["name"]);
  }

  for (const i in character_data["defenses"]) {
    const defense_data = character_data["defenses"][i];
    await db.new_defense(defense_data);
    await db.assign_defense(
      character_data["name"],
      defense_data["type"],
      defense_data["defense"],
    );
  }
} catch (error) {
  console.log(error);
}
