// Query for username and password in DB for authenticating
const {Client}  = require('pg'); 
const conn_string = require('./db_config');

async function authen(uname, pword){
    let auth = false;
    let role = "";
    let department_id;
    const client = new Client(conn_string);
    await client.connect(); 
    const query_string = {
        text: 'SELECT * FROM users WHERE name=$1 AND pass_word=$2',
        values: [uname, pword],
    }
    const query_result = await client.query(query_string)

    if (query_result.rowCount == 1) {
        auth = true;
        role=query_result.rows[0].role;
        if (role!="admin"){
            department_id=0;
        }
        else department_id=query_result.rows[0].department_id;
    } 
    await client.end();
    return {"auth": auth, "role": role, "department_id": department_id};
}

module.exports = authen;