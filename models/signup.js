const {Client}  = require('pg'); 
const conn_string = require('./db_config');

async function regis(req_body) {
    
    let name = req_body.uname;
    let pword = req_body.pword;
    let rpword = req_body.rpword;
    let role =req_body.chosse_role;
    let shop = req_body.shop_selected;
    let auth = false;

    const client = new Client(conn_string);
    await client.connect(); 
    let str=`SELECT COUNT(id) FROM users;`
    let str_data =  await client.query(str);
    let count_id = parseInt(str_data.rows[0].count) + 1;
    if (pword==rpword){
        auth=true;
        const query_string = {
            text: `INSERT INTO users VALUES ($1, $2, $3, $4, $5);`,
            values: [count_id, name, role, pword, shop],
        }
        const query_result = await client.query(query_string);
    }
    return {"auth":auth};
}
    

module.exports = regis;