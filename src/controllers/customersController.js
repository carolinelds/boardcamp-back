import db from "./../db.js";

export async function getCustomers(req,res){
    const filterString = req.query.cpf;
    
    try {
        if (filterString){
            const query = `
                SELECT customers.*  
                FROM customers
                WHERE customers.cpf LIKE '$1%'
            `;
            const values = [parseInt(filterString)];
            const customers = await db.query(query,values);

            res.send(customers.rows);

        } else {
            const query = `
                SELECT customers.*  
                FROM customers
            `;
            const customers = await db.query(query);

            res.send(customers.rows);
        }
    } catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter os clientes!");
    }
}
