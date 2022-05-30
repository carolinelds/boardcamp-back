import { Router } from 'express';
import { getCustomers, createCustomer } from "./../controllers/customersController.js";
import { customersMiddleware } from "./../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.post("/customers", customersMiddleware, createCustomer);

export default customersRouter;