import { Router } from "express";
import {addRequisicion, updRequisicion, delRequisicion} from "../controllers/operacion/requisicion.controller.js";
import {addProyecto, updProyecto, delProyecto, getProductoo, addServicio, deleteInsumo, addPrefacturaOP, addProducto, updProducto, updServicio, addPf} from "../controllers/operacion/proyectos.controllers.js";
import {updAutorizacion, delAutorizacion} from "../controllers/operacion/autorizacion.controller.js";
import {addFolio, updFolio, delFolio} from "../controllers/operacion/folio.controller.js";
const rutasOperacion = Router();

rutasOperacion.post('/addRequisicion', addRequisicion);
rutasOperacion.post('/updRequisicion/:id', updRequisicion);
rutasOperacion.delete('/delRequisicion/:id', delRequisicion);



rutasOperacion.post('/addProyecto', addProyecto);  //? info del proyecto

rutasOperacion.post('/updProyecto/:id', updProyecto); //?Actualiza info del proyecto

rutasOperacion.post('/delProyecto/:id', delProyecto); //?Elimina info del proyecto

//? productos / servicios
rutasOperacion.get('/getProducto/', getProductoo); //?Obtiene info del proyecto

rutasOperacion.post('/addServicio', addServicio)//? add  servicio cotizacion / proyecto
rutasOperacion.post('/deleteInsumo/:id', deleteInsumo)//! del  servicio cotizacion / proyecto
rutasOperacion.post('/addProductToProject', addProducto)//? add producto cotizacion / proyecto
rutasOperacion.put('/updProductToProject/:id', updProducto)//? upd producto cotizacion / proyecto
rutasOperacion.put('/updServiceToProject/:id', updServicio)//? upd producto cotizacion / proyecto
rutasOperacion.post('/addPf/:id', addPf)//? add pf to cotizacion / proyecto



//?Autorizacion
rutasOperacion.post('/updAutorizacion/:id', updAutorizacion);
rutasOperacion.post('/delAutorizacion/:id', delAutorizacion);
//rutasOperacion.get('/autorizacion', getRequisicion);


rutasOperacion.post('/addFolio', addFolio);
rutasOperacion.post('/updFolio/:id', updFolio);
rutasOperacion.post('/delFolio/:id', delFolio);


//?Prefactura
rutasOperacion.post('/operacion/prefacturar', addPrefacturaOP);

export default rutasOperacion;

 