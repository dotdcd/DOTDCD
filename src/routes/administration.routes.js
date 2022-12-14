import { Router } from "express";
import { addPrefactura } from "../controllers/administracion/prefactura.controller.js";
import { addCliente, updCliente} from "../controllers/administracion/cliente.controller.js";
import { addDisciplina, updDisciplina} from "../controllers/administracion/disciplina.controller.js";
import { addProveedor, updProveedor } from "../controllers/administracion/proveedor.controller.js";
import { addCables, updCables } from "../controllers/administracion/cables.controller.js";
const administrationRoutes = Router();

//? Prefactura Functions Routes
administrationRoutes.post('/addPrefactura', addPrefactura)


//? Cliente Functions Routes
administrationRoutes.post('/addCliente', addCliente)

//* upd Cliente
administrationRoutes.post('/updCliente', updCliente)


//? add Disciplina
administrationRoutes.post('/addDisciplina', addDisciplina)

//*upd Disciplina
administrationRoutes.post('/updDisciplina', updDisciplina)


//?add Proveedor
administrationRoutes.post('/addProveedor', addProveedor)
//* upd Proveedor
administrationRoutes.post('/updProveedor', updProveedor)


//? add Cables
administrationRoutes.post('/addCables', addCables)

//* upd Cables
administrationRoutes.post('/updCables', updCables)


// Path: prefactura.controller.js
export default administrationRoutes;