import db from "./../db.js";
import customerSchema from "./../schemas/customerSchema.js";

export async function checkCustomerSchema(req, res, next) {
    const customer = req.body;

    try {
        const { error } = customerSchema.validate(customer, { abortEarly: false });
        if (error) {
            res.status(400).send(error.details.map(detail => detail.message));
            return;
        }

    } catch (e) {
        res.status(500).send("Erro inesperado na validação dos dados.");
        return;
    }

    next();
}

export async function checkCustomerCpf(req, res, next) {
    const customer = req.body;

    try {
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
