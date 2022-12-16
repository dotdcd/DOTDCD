import { Router } from "express";
import { addPrefactura } from "../controllers/administracion/prefactura.controller.js";
import { addCliente, updCliente, delCliente} from "../controllers/administracion/cliente.controller.js";
import { addDisciplina, updDisciplina, delDisciplina} from "../controllers/administracion/disciplina.controller.js";
import { addProveedor, updProveedor, delProveedor } from "../controllers/administracion/proveedor.controller.js";
import { addCables, updCables, delCables } from "../controllers/administracion/cables.controller.js";
import { addFactura } from "../controllers/administracion/facturas.contrroller.js"
const administrationRoutes = Router();

//? Prefactura Functions Routes
administrationRoutes.post('/addPrefactura', addPrefactura)


//? Cliente Functions Routes
administrationRoutes.post('/addCliente', addCliente)

//* upd Cliente
administrationRoutes.post('/updCliente/:id', updCliente)

//! del Cliente
administrationRoutes.delete('/delCliente/:id', delCliente)




//? add Disciplina
administrationRoutes.post('/addDisciplina', addDisciplina)

//*upd Disciplina
administrationRoutes.post('/updDisciplina/:id', updDisciplina)

//! del Disciplina
administrationRoutes.delete('/delDisciplina/:id', delDisciplina)




//?add Proveedor
administrationRoutes.post('/addProveedor', addProveedor)

//* upd Proveedor
administrationRoutes.post('/updProveedor/:id', updProveedor)

//! del Proveedor
administrationRoutes.delete('/delProveedor/:id', delProveedor)



//? add Cables
administrationRoutes.post('/addCables', addCables)

//* upd Cables
administrationRoutes.post('/updCables/:id', updCables)

//! del Cables
administrationRoutes.delete('/delCables/:id', delCables)

//? Timbrado facturas

administrationRoutes.post('/addFactura', addFactura)

//! End timbrado facturas



// Path: prefactura.controller.js
export default administrationRoutes;