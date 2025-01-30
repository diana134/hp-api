# Instructions to Run Locally
```
npm install
node server.js
```

# API Usage Examples

## Apply damage
```
PATCH http://127.0.0.1:3000/damage/briv
{
  "damage_type": "slashing",
  "damage_value": 5
}
```

## Apply healing
```
PATCH http://127.0.0.1:3000/heal/briv
{
  "healing_value": 10
}
```

## Apply temporary hit points
```
PATCH http://127.0.0.1:3000/temp_hp/briv
body: {
  "temp_hp": 10
}
```

# Future Work
## A better DB
I chose SQLite because it's lightweight and easy to protype with for a small project like this. For a production system, I would want something more robust like PostrgrSQL or MySQL.

## Security
### Authentication
Currently, anyone can send requests to the server. In a production system I'd want to implement some kind of client-server authentication. This would prevent character data from essentially being public information, as well as mitigate any kind of cheating regarding hit point manipulation.

### Data Sanitization
I'm not confident that my api is protected against SQL injection. For a production system, I'd spend more time making sure any user-submitted data is sanatized and safe. 