import { Router } from "express";
import { addPrefactura } from "../controllers/administracion/prefactura.controller.js";

const administrationRoutes = Router();

administrationRoutes.post('/addPrefactura', addPrefactura)

export default administrationRoutes;