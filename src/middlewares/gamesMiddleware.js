import db from "./../db.js";
import gameSchema from "./../schemas/gameSchema.js";

export async function gamesMiddleware(req, res, next) {

    const game = req.body;

    try {
        let maxId = await db.query(`SELECT MAX(id) FROM categories`);
        maxId.rows[0].max ? maxId = maxId.rows[0].max : maxId = 1;

        const { error } = gameSchema.validate(game, { abortEarly: false });
        if (error) {
            res.status(400).send(error.details.map(detail => detail.message));
            return;
        }

        const query = `
            SELECT * FROM games
            WHERE name = $1
        `;
        const values = [game.name.toLowerCase()];
        const checkExists = await db.query(query, values);
        console.log(checkExists);
        if (checkExists.rowCount !== 0) {
            res.status(409).send("Esse jogo já foi cadastrado.");
            return;
        }
    } catch (e) {
        res.status(500).send("Erro inesperado na validação dos dados.");
        return;
    }

    next();
}