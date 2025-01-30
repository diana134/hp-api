# Instructions to Run Locally

`npm install`
`node server.js`

# API Instructions

## Apply damage
`PATCH http://127.0.0.1:3000/damage/briv
body: {
  "damage_type": "slashing",
  "damage_value": 5
}`

## Apply healing
`PATCH http://127.0.0.1:3000/heal/briv
body: {
  "healing_value": 10
}`

## Apply temporary hit points
`PATCH http://127.0.0.1:3000/temp_hp/briv
body: {
  "temp_hp": 10
}`