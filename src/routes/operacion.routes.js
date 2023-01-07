import { Router } from "express";
import {addRequisicion, updRequisicion, delRequisicion} from "../controllers/operacion/requisicion.controller.js";
import {addProyecto, updProyecto, delProyecto} from "../controllers/operacion/proyectos.controllers.js";
import {updAutorizacion, delAutorizacion} from "../controllers/operacion/autorizacion.controller.js";
const rutasOperacion = Router();

rutasOperacion.post('/addRequisicion', addRequisicion);
rutasOperacion.post('/updRequisicion/:id', updRequisicion);
rutasOperacion.delete('/delRequisicion/:id', delRequisicion);


rutasOperacion.post('/addProyecto', addProyecto);
rutasOperacion.post('/updProyecto/:id', updProyecto);
rutasOperacion.post('/delProyecto/:id', delProyecto);



//?Autorizacion
rutasOperacion.post('/updAutorizacion/:id', updAutorizacion);
rutasOperacion.post('/delAutorizacion/:id', delAutorizacion);
//rutasOperacion.get('/autorizacion', getRequisicion);
export default rutasOperacion;

 