import db from "./../db.js";

export async function getCategories(req, res) {

    try {
        const result = await db.query('SELECT * FROM categories');
        const categories = result.rows;
        res.send(categories);

    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter as categorias");
    }
}

export async function createCategory(req, res) {

    const category = req.body;

    try {
        const query = `
            INSERT INTO categories (name)
            VALUES ($1)
        `;

        const values = [category.name];

        await db.query(query, values);

        res.sendStatus(201);

    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao criar a categoria!");
    }
}

