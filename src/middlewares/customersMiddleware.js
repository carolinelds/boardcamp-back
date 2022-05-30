import joi from "joi";
import db from "./../db.js";

export async function customersMiddleware(req, res, next) {

    const customer = req.body;

    try {

        const regexPhone = /^[0-9](\d{10}|\d{11})$/; 
        const regexCpf = /^[0-9]{11}$/;
        
        const customerSchema = joi.object({
            name: joi.string().trim().required(),
            phone: joi.string().trim().pattern(regexPhone).required(),
            cpf: joi.string().trim().pattern(regexCpf).required(),
            birthday: joi.date().required()
        });

        const { error } = customerSchema.validate(customer, { abortEarly: false });
        if (error) {
            res.status(400).send(error.details.map(detail => detail.message));
            return;
        }

        const query = `
            SELECT * FROM customers
            WHERE cpf = $1
        `;
        const values = [customer.cpf];
        const checkExists = await db.query(query, values);
        if (checkExists.rowCount !== 0) {
            res.status(409).send("Esse CPF já foi cadastrado.");
            return;
        }
    } catch (e) {
        res.status(500).send("Erro inesperado na validação dos dados.");
        return;
    }

    next();
}