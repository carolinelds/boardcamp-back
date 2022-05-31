import joi from "joi";

const gameSchema = joi.object({
    name: joi.string().trim().required(),
    image: joi.string().trim().required(),
    stockTotal: joi.number().greater(0).required(),
    categoryId: joi.number().min(1).max(maxId).required(),
    pricePerDay: joi.number().greater(0).required()
});

export default gameSchema;