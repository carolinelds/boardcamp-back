import joi from "joi";
import db from "./../db.js";

export function categoriesMiddleware(req,res,next){
    const category = req.body;

    const categorySchema = joi.object({
        name: joi.string().trim().required()
    });
    const {error} = categorySchema.validate(category, {abortEarly: false});
    if (error){
        res.status(400).send(error.details.map(detail => detail.message));
        return;
    }

    const query = `
        SELECT * FROM categories
        WHERE name = $1
    `;
    const values = [category.name.toLowerCase()];
    const checkExists = db.query(query,values);
    if (checkExists) {
        res.status(409).send("Essa categoria já existe.");
        return;
    }

    next();
}