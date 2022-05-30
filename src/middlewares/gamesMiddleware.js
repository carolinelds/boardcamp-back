import joi from "joi";
import db from "./../db.js";

export async function gamesMiddleware(req, res, next) {

    const game = req.body;

    try {
        let maxId = await db.query(`SELECT MAX(id) FROM games`);
        console.log(maxId.rows[0].max);
        maxId.rows[0].max ? maxId = maxId.rows[0].max : maxId = 1;

        const gameSchema = joi.object({
            name: joi.string().trim().required(),
            image: joi.string().trim().required(),
            stockTotal: joi.number().greater(0).required(),
            categoryId: joi.number().min(1).max(maxId).required(),
            pricePerDay: joi.number().greater(0).required()
        });

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
        const checkExists = db.query(query, values);
        if (checkExists) {
            res.status(409).send("Esse jogo já foi cadastrado.");
            return;
        }
    } catch (e) {
        res.status(500).send("Erro inesperado na validação dos dados.");
        return;
    }

    next();
}