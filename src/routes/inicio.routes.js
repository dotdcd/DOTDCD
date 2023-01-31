import { Router } from "express";

import { authenticateUser, isAdmin } from "../middlewares/auth.js";
import { updUser } from "../controllers/inicio/inicio.controller.js";

const inicioRoutes = Router();


inicioRoutes.post('/updUser/:id', updUser)

export default inicioRoutes;