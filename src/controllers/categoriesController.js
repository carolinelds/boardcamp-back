import db from "./../db.js";

export async function getCategories(req, res) {

    try {
		const result = await db.query('SELECT * FROM categories');
		const categories = result.rows; 
        res.send(categories);

	} catch(e) {
		console.log(e);
		res.status(500).send("Ocorreu um erro ao obter as categorias");
	}
}

