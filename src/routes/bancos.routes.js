import { Router } from "express";

import { authenticateUser, isAdmin } from "../middlewares/auth.js";

import { genTxt } from "../controllers/bancos/egresos.controllers.js";

const bancosRoutes = Router();

//?add egreso
bancosRoutes.get("/gentext", genTxt);

export default bancosRoutes;