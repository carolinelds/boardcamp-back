import { Router } from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer } from "./../controllers/customersController.js";
import { checkCustomerSchema, checkCustomerCpf } from "./../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", checkCustomerSchema, checkCustomerCpf, createCustomer);
customersRouter.put("/customers/:id", checkCustomerSchema, updateCustomer); // requisito está errado no notion, não pode bloquear a edição se já tiver cpf cadastrado, se não nunca vai conseguir editar dados de clientes

export default customersRouter;