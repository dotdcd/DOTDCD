import { Router } from "express";

import { authenticateUser, isAdmin } from "../middlewares/auth.js";

import { genTxt, addEgreso } from "../controllers/bancos/egresos.controllers.js";

const bancosRoutes = Router();

//?add egreso
bancosRoutes.get("/gentext/:id", genTxt);
bancosRoutes.post("/addEgreso", addEgreso);

export default bancosRoutes;