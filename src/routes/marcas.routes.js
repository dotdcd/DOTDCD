import { Router } from "express";
import { addMarca } from "../controllers/administracion/marca.controller.js";
const rutasMarca = Router();

rutasMarca.post('/administracion/marca/addMarca', addMarca);

export default rutasMarca;