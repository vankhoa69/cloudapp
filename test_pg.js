const {Client}  = require('pg')
 
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123456',
  port: 5432,
})
 
client.connect()
 
console.log(client.query('SELECT * FROM users'))
