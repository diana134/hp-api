import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


// const config = require('./briv.json');
import * as fs from 'fs';
const character_data = JSON.parse(fs.readFileSync('./briv.json'))
console.log(character_data);

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