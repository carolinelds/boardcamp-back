import joi from "joi";

const regexPhone = /^[0-9](\d{10}|\d{11})$/;
const regexCpf = /^[0-9]{11}$/;

const customerSchema = joi.object({
    name: joi.string().trim().required(),
    phone: joi.string().trim().pattern(regexPhone).required(),
    cpf: joi.string().trim().pattern(regexCpf).required(),
    birthday: joi.date().required()
});

export default customerSchema;