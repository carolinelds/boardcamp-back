import db from "./../db.js";

export async function getCustomers(req,res){
    const filterString = req.query.cpf;
    try {
        if (filterString){
            const query = `
                SELECT customers.*  
                FROM customers
                WHERE customers.cpf LIKE '${filterString}%'
            `;
            const customers = await db.query(query);

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

export async function createCustomer(req,res){
    const {name, phone, cpf, birthday} = req.body;

    try {
        
        const query = `
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [name, phone, cpf, birthday];
        await db.query(query,values);

        res.sendStatus(201);

    } catch(e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao cadastrar o cliente.");
    }
}
