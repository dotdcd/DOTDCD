import { Router } from "express";
import {addRequisicion, updRequisicion, delRequisicion} from "../controllers/operacion/requisicion.controller.js";
import {addProyecto, updProyecto, delProyecto, getProducto} from "../controllers/operacion/proyectos.controllers.js";
import {updAutorizacion, delAutorizacion} from "../controllers/operacion/autorizacion.controller.js";
import {addFolio, updFolio, delFolio} from "../controllers/operacion/folio.controller.js";
const rutasOperacion = Router();

rutasOperacion.post('/addRequisicion', addRequisicion);
rutasOperacion.post('/updRequisicion/:id', updRequisicion);
rutasOperacion.delete('/delRequisicion/:id', delRequisicion);


rutasOperacion.post('/addProyecto', addProyecto);
rutasOperacion.post('/updProyecto/:id', updProyecto);
rutasOperacion.post('/delProyecto/:id', delProyecto);
rutasOperacion.get('/getProducto', getProducto);


//?Autorizacion
rutasOperacion.post('/updAutorizacion/:id', updAutorizacion);
rutasOperacion.post('/delAutorizacion/:id', delAutorizacion);
//rutasOperacion.get('/autorizacion', getRequisicion);


rutasOperacion.post('/addFolio', addFolio);
rutasOperacion.post('/updFolio/:id', updFolio);
rutasOperacion.post('/delFolio/:id', delFolio);


export default rutasOperacion;

 