import { Router } from "express";

import { authenticateUser, isAdmin } from "../middlewares/auth.js";

import { genTxt, addEgreso } from "../controllers/bancos/egresos.controllers.js";
import { addIngreso } from "../controllers/bancos/ingresos.controllers.js";

const bancosRoutes = Router();

//?add egreso
bancosRoutes.get("/gentext/:id", genTxt);
bancosRoutes.post("/addEgreso", addEgreso);

//?add ingreso
bancosRoutes.post("/addIngreso", addIngreso);

export default bancosRoutes;