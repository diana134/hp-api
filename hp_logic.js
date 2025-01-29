import { type } from 'os';
import * as sql from './sql.js';

export const apply_damage = async (db, character_id, damage_type, damage_value) => {
    try {
        let character = await sql.get_character(db, character_id);
        const defense = await sql.get_character_defense(db, character_id, damage_type.toLowerCase().replace(/\s/g, ''));

        let damage_modifier = 1;
        console.log(defense);
        if (typeof defense !== 'undefined') {
            if (defense.defense === 'resistance') {
                damage_modifier = 0.5;
            } else if (defense.defense === 'immunity') {
                damage_modifier = 0;
            }
        }
        console.log(damage_modifier);
        let remaining_damage = damage_value * damage_modifier;
        character.temp_hit_points = character.temp_hit_points - remaining_damage;

        if (character.temp_hit_points < 0) {
            remaining_damage = character.temp_hit_points * -1;
            character.temp_hit_points = 0;
        }

        character.hit_points = character.hit_points - remaining_damage;    

        await sql.update_character_hit_points(db, character_id, character.hit_points, character.temp_hit_points);

        return character;
    } catch (err) {
        console.log(err);
        return null;
    }
}