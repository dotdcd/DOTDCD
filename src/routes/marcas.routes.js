import { Router } from "express";
import { addMarca, updMarca, delMarca } from "../controllers/administracion/marca.controller.js";
const rutasMarca = Router();

rutasMarca.post('/administracion/marca/addMarca', addMarca);
rutasMarca.put('/administracion/marca/updMarca', updMarca);
rutasMarca.delete('/administracion/marca/delMarca/:marca_id', delMarca);

export default rutasMarca;