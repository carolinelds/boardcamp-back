import { Router } from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer } from "./../controllers/customersController.js";
import { customersMiddleware } from "./../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", customersMiddleware, createCustomer);
customersRouter.put("/customers/:id", customersMiddleware, updateCustomer);

export default customersRouter;