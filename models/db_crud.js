const {Client}  = require('pg'); 
const conn_string = require('./db_config');

async function crud(req_body) {
    let id = parseInt(req_body.id);
    let name = req_body.name;
    let price = parseInt(req_body.price);
    let amount = parseInt(req_body.amount);
    let shop = parseInt(req_body.shop_id);
    let btn = req_body.btn;
    let crud_result = false
    // Connect to database
    const client = new Client(conn_string);
    await client.connect(); 
    if (btn == "Update") {
        var edit_query = 
        {
            text: `UPDATE products 
            SET name = $2,
                price = $3,
                amount = $4,
                shop_id = $5
            WHERE id = $1;`,
            values: [id, name, price, amount, shop]
        }; 
    var edit_data = await client.query(edit_query);
    return edit_data;
    }
    else if (btn == "Delete") {
        var delete_query = 
        {
            text: 'DELETE FROM products WHERE id = $1',
            values: [id]
        }; 
    var delete_data = await client.query(delete_query);
    return delete_data;
    }
    else {
        // query to insert a new row
        const query_string = {
            text: `INSERT INTO products VALUES ($1, $2, $3, $4, $5);`,
            values: [id, name, price, amount, shop],
        }
        let query_results = await client.query(query_string);
        console.log(`INSERTED ${id} ${name} ${price} ${amount} ${shop}`);
        console.log(query_results);
    }
}

module.exports = crud;