import { Router } from 'express';
import { getRentals, createRental } from './../controllers/rentalsController.js';
import { 
    checkCustomerId,
    checkGameId,
    daysRentedIsPositive
} from './../middlewares/rentalsMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", checkCustomerId, checkGameId, daysRentedIsPositive, createRental);

export default rentalsRouter;