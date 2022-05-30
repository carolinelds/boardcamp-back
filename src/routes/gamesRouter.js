import { Router } from 'express';
import { getGames, createGame } from './../controllers/gamesController.js';
import { gamesMiddleware } from './../middlewares/gamesMiddleware.js';

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", gamesMiddleware, createGame)

export default gamesRouter;