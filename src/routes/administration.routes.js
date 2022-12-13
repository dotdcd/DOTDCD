import { Router } from "express";
import { addPrefactura } from "../controllers/administracion/prefactura.controller.js";
import { addCliente } from "../controllers/administracion/cliente.controller.js";
import { addDisciplina } from "../controllers/administracion/disciplina.controller.js";
import { addProveedor } from "../controllers/administracion/proveedor.controller.js";
import { addCables } from "../controllers/administracion/cables.controller.js";
const administrationRoutes = Router();

//? Prefactura Functions Routes
administrationRoutes.post('/addPrefactura', addPrefactura)


//? Cliente Functions Routes
administrationRoutes.post('/addCliente', addCliente)


//? add Disciplina
administrationRoutes.post('/addDisciplina', addDisciplina)


//?add Proveedor
administrationRoutes.post('/addProveedor', addProveedor)

//? add Cables
administrationRoutes.post('/addCables', addCables)


// Path: prefactura.controller.js
export default administrationRoutes;