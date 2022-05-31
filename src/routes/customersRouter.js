import { Router } from 'express';
import { getCustomers, getCustomer, createCustomer } from "./../controllers/customersController.js";
import { customersMiddleware } from "./../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", customersMiddleware, createCustomer);

export default customersRouter;