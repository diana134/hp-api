export const initialize = async (db) => {
    return new Promise((resolve, reject) => {
        db.exec(
            `CREATE TABLE IF NOT EXISTS characters (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              level INTEGER NOT NULL DEFAULT 1,
              hitpoints INTEGER NOT NULL DEFAULT 0,
              strength INTEGER NOT NULL DEFAULT 0,
              dexterity INTEGER NOT NULL DEFAULT 0,
              constitution INTEGER NOT NULL DEFAULT 0,
              intelligence INTEGER NOT NULL DEFAULT 0,
              wisdone INTEGER NOT NULL DEFAULT 0,
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
              affectedobject TEXT NOT NULL,
              affectedvalue TEXT NOT NULL,
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
              type TEXT NOT NULL,
              defense TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS characters_defenses (
              character_id TEXT PRIMARY KEY,
              defense_id TEXT,
              FOREIGN KEY (character_id) REFERENCES characters(id),
              FOREIGN KEY (defense_id) REFERENCES defenses(id)
            );`, (err) => {
                if (err) reject(err);
                resolve();
            }
          );
    });
  };
  