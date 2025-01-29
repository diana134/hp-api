export const initialize = async (db) => {
    return new Promise((resolve, reject) => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS characters (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              level INTEGER NOT NULL DEFAULT 1,
              hit_points INTEGER NOT NULL DEFAULT 0,
              temp_hit_points INTEGER NOT NULL DEFAULT 0,
              strength INTEGER NOT NULL DEFAULT 0,
              dexterity INTEGER NOT NULL DEFAULT 0,
              constitution INTEGER NOT NULL DEFAULT 0,
              intelligence INTEGER NOT NULL DEFAULT 0,
              wisdom INTEGER NOT NULL DEFAULT 0,
              charisma INTEGER NOT NULL DEFAULT 0
            );
          
            CREATE TABLE IF NOT EXISTS classes (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              hit_dice_value INTEGER NOT NULL DEFAULT 0
            );
          
            CREATE TABLE IF NOT EXISTS characters_classes (
              character_id TEXT PRIMAY KEY,
              class_id TEXT,
              level INTEGER NOT NULL DEFAULT 0,
              FOREIGN KEY (character_id) REFERENCES characters(id),
              FOREIGN KEY (class_id) REFERENCES classes(id)
            );
          
            CREATE TABLE IF NOT EXISTS items (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              affected_object TEXT NOT NULL,
              affected_value TEXT NOT NULL,
              value INTEGER NOT NULL DEFAULT 0
            );
          
            CREATE TABLE IF NOT EXISTS characters_items (
              character_id TEXT PRIMARY KEY,
              item_id TEXT,
              FOREIGN KEY (character_id) REFERENCES characters(id),
              FOREIGN KEY (item_id) REFERENCES items(id)
            );
            
            CREATE TABLE IF NOT EXISTS defenses (
              id TEXT PRIMARY KEY,
              type TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS characters_defenses (
              character_id TEXT PRIMARY KEY,
              defense_id TEXT NOT NULL,
              defense TEXT NOT NULL,
              FOREIGN KEY (character_id) REFERENCES characters(id),
              FOREIGN KEY (defense_id) REFERENCES defenses(id)
            );`, (err) => {
                if (err) reject(err);
                resolve();
            }
          );
    });
  };
  
  export const new_character = async (db, character_data) => {
    const character_id = character_data['name'].toLowerCase().replace(/\s/g, ''); // use character name all lowercase with spaces removed as the identifier
    const query = 
      `INSERT OR REPLACE INTO characters (id, name, level, hit_points, strength, dexterity, constitution, intelligence, wisdom, charisma)
      VALUES ('${character_id}', 
        '${character_data['name']}', 
        ${character_data['level']}, 
        ${character_data['hitPoints']}, 
        ${character_data['stats']['strength']}, 
        ${character_data['stats']['dexterity']}, 
        ${character_data['stats']['constitution']}, 
        ${character_data['stats']['intelligence']}, 
        ${character_data['stats']['wisdom']}, 
        ${character_data['stats']['charisma']})`;
    return new Promise((resolve, reject) => {
        db.exec(query,
            (err) => {
                if (err) reject(err);
                resolve();
            }
          );
    });
  };


export const new_class = async (db, class_data) => {
  const class_id = class_data['name'].toLowerCase().replace(/\s/g, ''); // use class name all lowercase with spaces removed as the identifier
  const query = 
    `INSERT OR REPLACE INTO classes (id, name, hit_dice_value)
    VALUES ('${class_id}', 
      '${class_data['name']}', 
      ${class_data['hitDiceValue']})`;
  return new Promise((resolve, reject) => {
      db.exec(query,
          (err) => {
              if (err) reject(err);
              resolve();
          }
        );
  });
};

export const new_item = async (db, item_data) => {
  const item_id = item_data['name'].toLowerCase().replace(/\s/g, ''); // use item name all lowercase with spaces removed as the identifier
  const query = 
    `INSERT OR REPLACE INTO items (id, name, affected_object, affected_value, value)
    VALUES ('${item_id}', 
      '${item_data['name']}', 
      '${item_data['modifier']['affectedObject']}',
      '${item_data['modifier']['affectedValue']}',
      ${item_data['modifier']['value']})`;
  return new Promise((resolve, reject) => {
      db.exec(query,
          (err) => {
              if (err) reject(err);
              resolve();
          }
        );
  });
};

export const new_defense = async (db, defense_data) => {
  const defense_id = defense_data['type'].toLowerCase().replace(/\s/g, ''); // use defense type all lowercase with spaces removed as the identifier
  const query = 
    `INSERT OR REPLACE INTO defenses (id, type)
    VALUES ('${defense_id}', 
      '${defense_data['type']}')`;
  return new Promise((resolve, reject) => {
      db.exec(query,
          (err) => {
              if (err) reject(err);
              resolve();
          }
        );
  });
};

export const assign_class = async (db, character_name, class_name, level) => {
  const character_id = character_name.toLowerCase().replace(/\s/g, '');
  const class_id = class_name.toLowerCase().replace(/\s/g, '');
  const query = 
    `INSERT OR REPLACE INTO characters_classes (character_id, class_id, level)
    VALUES ('${character_id}', 
      '${class_id}', 
      ${level})`;
  return new Promise((resolve, reject) => {
      db.exec(query,
          (err) => {
              if (err) reject(err);
              resolve();
          }
        );
  });
};
  
export const assign_item = async (db, character_name, item_name) => {
  const character_id = character_name.toLowerCase().replace(/\s/g, '');
  const item_id = item_name.toLowerCase().replace(/\s/g, '');
  const query = 
    `INSERT OR REPLACE INTO characters_items (character_id, item_id)
    VALUES ('${character_id}', 
      '${item_id}')`;
  return new Promise((resolve, reject) => {
      db.exec(query,
          (err) => {
              if (err) reject(err);
              resolve();
          }
        );
  });
};

export const assign_defense = async (db, character_name, defense_type, defense) => {
  const character_id = character_name.toLowerCase().replace(/\s/g, '');
  const defense_id = defense_type.toLowerCase().replace(/\s/g, '');
  const query = 
    `INSERT OR REPLACE INTO characters_defenses (character_id, defense_id, defense)
    VALUES ('${character_id}', 
      '${defense_id}',
      '${defense}')`;
  return new Promise((resolve, reject) => {
      db.exec(query,
          (err) => {
              if (err) reject(err);
              resolve();
          }
        );
  });
};

export const get_character = async (db, character_id) => {
  const query =`SELECT * FROM characters WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(query, [character_id], (err, character) => {
      if (err) reject(err);
      resolve(character);
    });
  });
};

export const get_character_defense = async (db, character_id, defense_id) => {
  const query =`SELECT * FROM characters_defenses WHERE character_id = ? and defense_id = ?`;
  console.log(query, character_id, defense_id);
  return new Promise((resolve, reject) => {
    db.get(query, [character_id, defense_id], (err, defense) => {
      if (err) reject(err);
      resolve(defense);
    });
  });
}

export const update_character_hit_points = async (db, character_id, hp, temp_hp) => {
  const query = `UPDATE characters 
    SET hit_points = ?,
      temp_hit_points = ?
    WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [hp, temp_hp, character_id], (err) => {
        if (err) reject(err);
        resolve();
      });
    });
}