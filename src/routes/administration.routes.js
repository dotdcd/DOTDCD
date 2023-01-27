import { Router } from "express";

import { authenticateUser, isAdmin } from "../middlewares/auth.js";

import { addPrefactura, getTipoValor } from "../controllers/administracion/prefactura.controller.js";
import { addCliente, updCliente, delCliente} from "../controllers/administracion/cliente.controller.js";
import { addDisciplina, updDisciplina, delDisciplina} from "../controllers/administracion/disciplina.controller.js";
import { addProveedor, updProveedor, delProveedor } from "../controllers/administracion/proveedor.controller.js";
import { addCables, updCables, delCables } from "../controllers/administracion/cables.controller.js";
import { addDispositivo, addDispositivoComponente, updDispositivo1, updDispositivo2, delDispositivo } from "../controllers/administracion/dispositivo.controller.js";
import { addFactura, cancelFactura } from "../controllers/administracion/facturas.contrroller.js";
import {addMarca, updMarca, delMarca, addProveedorMarca, delPMarca} from "../controllers/administracion/marca.controller.js";
import {addProducto, updProducto, delProducto} from "../controllers/administracion/producto.controller.js";
const administrationRoutes = Router();

//? Prefactura Functions Routes
administrationRoutes.post('/addPrefactura', addPrefactura)

//?Factura Get tipo de valor
administrationRoutes.get('/getTipoValor', getTipoValor)

//? Marca Add
administrationRoutes.post('/addMarca', addMarca)

//* Marca upd
administrationRoutes.post('/updMarca/:id', updMarca)

//! Marca del
administrationRoutes.delete('/delMarca/:id', delMarca)


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

//?add Dispositivo
administrationRoutes.post('/AddDispositivo', addDispositivo)
//*upd Dispositivo
administrationRoutes.post('/updDispositivo1/:id', updDispositivo1)
administrationRoutes.post('/updDispositivo2/:id', updDispositivo2)

administrationRoutes.post('/addDispositivoComponente/', addDispositivoComponente)

//! del Dispositivo
administrationRoutes.post('/delDispositivo/:id', delDispositivo)

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

administrationRoutes.post('/addFactura', [authenticateUser, isAdmin], addFactura)
administrationRoutes.put('/cancelFactura/:id', [authenticateUser, isAdmin], cancelFactura)

//! End timbrado facturas

//?add proveedor por marca
administrationRoutes.post('/addprvMarca', addProveedorMarca)
//!del proveedor por marca
administrationRoutes.delete('/delPMarca/:id', delPMarca)



//? add producto o servicio
administrationRoutes.post('/addProducto', addProducto)

//* upd producto o servicio
administrationRoutes.post('/updProducto/:id', updProducto)

//! del producto o servicio
administrationRoutes.post('/delProducto/:id', delProducto)


// Path: prefactura.controller.js
export default administrationRoutes;