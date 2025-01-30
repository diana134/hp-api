import { type } from 'os';
import * as sql from './sql.js';

export const apply_damage = async (db, character_id, damage_type, damage_value) => {
    try {
        let character = await sql.get_character(db, character_id);
        const defense = await sql.get_character_defense(db, character_id, damage_type.toLowerCase().replace(/\s/g, ''));

        let damage_modifier = 1;
        if (typeof defense !== 'undefined') {
            if (defense.defense === 'resistance') {
                damage_modifier = 0.5;
            } else if (defense.defense === 'immunity') {
                damage_modifier = 0;
            }
        }
        
        let remaining_damage = Math.floor(damage_value * damage_modifier); // round down all fractions
        character.temp_hit_points = character.temp_hit_points - remaining_damage;

        if (character.temp_hit_points < 0) {
            remaining_damage = character.temp_hit_points * -1;
            character.temp_hit_points = 0;
        } else {
            remaining_damage = 0;
        }

        character.hit_points = character.hit_points - remaining_damage;    

        await sql.update_character_hit_points(db, character_id, character.hit_points, character.temp_hit_points);

        return character;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const apply_healing = async (db, character_id, value) => {
    try {
        let character = await sql.get_character(db, character_id);
        character.hit_points = character.hit_points + value;
        await sql.update_character_hit_points(db, character_id, character.hit_points, character.temp_hit_points);
        return character;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const apply_temp_hp = async (db, character_id, temp_hp) => {
    try {
        let character = await sql.get_character(db, character_id);

        if (character.temp_hit_points < temp_hp) {
            character.temp_hit_points = temp_hp;
            await sql.update_character_hit_points(db, character_id, character.hit_points, character.temp_hit_points);
        }
        
        return character;
    } catch (err) {
        console.log(err);
        return null;
    }
}