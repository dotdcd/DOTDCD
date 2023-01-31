import { Router } from 'express';
import {pool} from '../db.js';
import { read } from 'fs-extra';

//? Controllers

import { renderEmployees, renderAnalytics, renderProyectos, renderEdificios } from '../controllers/erp/analytics.controller.js';
import { renderUsuarios, renderEditarUsuario } from '../controllers/erp/inicio.controller.js';
import { renderOpProyAutorizarProyecto, renderOpProyAutorizar, renderOpProyNuevo,renderOpProyBuscar, renderOpProyEditar, renderOpReqBuscar, renderOpReqEditar, renderOpReqNuevo, renderFolioNuevo, renderFolioEditar, renderFolioBuscar } from '../controllers/erp/operacion.controller.js';
import { renderEprovMarca, renderProdNuevo,renderProdEditar, renderAdProvMarcaNuevo, renderDeditar, renderAdEditar, renderCeditar, renderPBEditar, renderAdBuscar, renderAdNuevo, renderDCEditar, renderVerPprefactura, renderVerPrefacturas, renderAdProvMarca, renderCliBuscar, renderCliEditar, renderPrefacturas, renderCliNuevo, renderDCBuscar, renderDCNuevo, renderPBNuevo, renderPBBuscar, renderProgPrefacturar, renderDnuevo, renderDbuscar, renderCbuscar, renderCnuevo, renderFacturas, renderFacturar, verFactura, renderProdBuscar,  renderTaxPdf} from '../controllers/erp/administracion.controller.js';

import { renderEmAsignar, renderEmBuscar, renderEmNuevo, renderEmTodos, renderEmployee, renderContEmployee, renderDoc, renderContratos, renderSignature, renderContrato, renderPastContrato, renderDocV, renderNMultiempresas, renderBMultiempresas, renderJornadas, renderCoBuscar, renderCoNuevo, renderCoRequerir, renderCoEditar, renderEMultiempresas, renderBBuscar, renderBNuevo, renderBEditar, renderEnuevos, renderInuevos, renderEbuscar, renderIngresosbuscar, renderIngresosEditar, renderEEditar} from '../controllers/erp/contabilidad.controller.js'


import { authenticateUser, isAdmin } from '../middlewares/auth.js';
import { authenticateSignature } from '../middlewares/signature.js';

const rutasErp = Router();
//?Home Route
/*
rutas.get('/dashboard/home', renderHome)
*/

//? Analytics routes
rutasErp.get('/dashboard/analytics/analytics', [authenticateUser, isAdmin], renderAnalytics)
rutasErp.get('/dashboard/analytics/empleados', [authenticateUser, isAdmin], renderEmployees)
rutasErp.get('/dashboard/analytics/proyectos', [authenticateUser, isAdmin], renderProyectos)
rutasErp.get('/dashboard/analytics/edificios', [authenticateUser, isAdmin], renderEdificios)


//?Inicio Routes
rutasErp.get('/dashboard/inicio/usuarios', [authenticateUser, isAdmin], renderUsuarios)
rutasErp.get('/dashboard/inicio/usuario/editar/:id', [authenticateUser, isAdmin], renderEditarUsuario)
/*
rutas.get('/dashboard/inicio/respaldo', renderRespaldo)

//?llllllllllllllllllllllllllllll
//?Operación Routes
//?llllllllllllllllllllllllllllll

//*llllllllllllllllllllllll
//*Proyectos
//*llllllllllllllllllllllll
//? */

//rutasErp.get('/dashboard/operacion/proyectos/nuevo', [authenticateUser, isAdmin], renderOpNuevo)


//?Operacion Routes

//?proyectos Routes2222222222
rutasErp.get('/dashboard/operacion/proyectos/nuevo', [authenticateUser, isAdmin], renderOpProyNuevo)
rutasErp.get('/dashboard/operacion/proyectos/buscar', [authenticateUser, isAdmin], renderOpProyBuscar)
rutasErp.get('/dashboard/operacion/proyectos/editar/:id', [authenticateUser, isAdmin], renderOpProyEditar)

rutasErp.get('/dashboard/operacion/proyectos/autorizar', [authenticateUser, isAdmin], renderOpProyAutorizar)
rutasErp.get('/dashboard/operacion/proyectos/autorizar/:id', [authenticateUser, isAdmin], renderOpProyAutorizarProyecto)

rutasErp.get('/dashboard/operacion/requerimientos/nuevo', [authenticateUser, isAdmin], renderOpReqNuevo)
rutasErp.get('/dashboard/operacion/requerimientos/buscar', [authenticateUser, isAdmin], renderOpReqBuscar)
rutasErp.get('/dashboard/operacion/requerimientos/editar/:id', [authenticateUser, isAdmin], renderOpReqEditar)

rutasErp.get('/dashboard/operacion/folios/nuevo', [authenticateUser, isAdmin], renderFolioNuevo)
rutasErp.get('/dashboard/operacion/folios/buscar', [authenticateUser, isAdmin], renderFolioBuscar)
rutasErp.get('/dashboard/operacion/folios/editar/:id', [authenticateUser, isAdmin], renderFolioEditar)

//?llllllllllllllllllllllllllllll
//?Administracion Routes
//?llllllllllllllllllllllllllllll
rutasErp.get('/dashboard/administracion/clientes/nuevo', [authenticateUser, isAdmin], renderCliNuevo)
rutasErp.get('/dashboard/administracion/clientes/buscar', [authenticateUser, isAdmin], renderCliBuscar)
rutasErp.get('/dashboard/administracion/clientes/editar/:id', [authenticateUser, isAdmin], renderCliEditar)

rutasErp.get('/dashboard/administracion/facturas/prefacturar', [authenticateUser, isAdmin], renderPrefacturas)
rutasErp.get('/dashboard/administracion/prefacturas/programar',[authenticateUser, isAdmin], renderProgPrefacturar)
rutasErp.get('/dashboard/administracion/prefacturas/ver',[authenticateUser, isAdmin], renderVerPrefacturas)
rutasErp.get('/dashboard/administracion/prefacturas/editar/:id',[authenticateUser, isAdmin], renderVerPprefactura)

rutasErp.get('/dashboard/administracion/marca/nuevo', [authenticateUser, isAdmin], renderAdNuevo)
rutasErp.get('/dashboard/administracion/marca/buscar', [authenticateUser, isAdmin], renderAdBuscar)
rutasErp.get('/dashboard/administracion/marca/editar/:id', [authenticateUser, isAdmin], renderAdEditar)
rutasErp.get('/dashboard/administracion/marca/prov_marca', [authenticateUser, isAdmin], renderAdProvMarca)
rutasErp.get('/dashboard/administracion/marca/prov_marca/editar/:id', [authenticateUser, isAdmin], renderEprovMarca)
rutasErp.get('/dashboard/administracion/marca/prov_marca/nuevo', [authenticateUser, isAdmin], renderAdProvMarcaNuevo)

rutasErp.get('/dashboard/administracion/disciplina/nuevo', [authenticateUser, isAdmin], renderDCNuevo)
rutasErp.get('/dashboard/administracion/disciplina/buscar', [authenticateUser, isAdmin], renderDCBuscar)
rutasErp.get('/dashboard/administracion/disciplina/editar/:id', [authenticateUser, isAdmin], renderDCEditar)

rutasErp.get('/dashboard/administracion/proveedores/nuevo', [authenticateUser, isAdmin], renderPBNuevo)
rutasErp.get('/dashboard/administracion/proveedores/buscar', [authenticateUser, isAdmin], renderPBBuscar)
rutasErp.get('/dashboard/administracion/proveedores/editar/:id', [authenticateUser, isAdmin], renderPBEditar)

rutasErp.get('/dashboard/administracion/dispositivos/nuevo', [authenticateUser, isAdmin], renderDnuevo)
rutasErp.get('/dashboard/administracion/dispositivos/buscar', [authenticateUser, isAdmin], renderDbuscar)
rutasErp.get('/dashboard/administracion/dispositivos/editar/:id', [authenticateUser, isAdmin], renderDeditar)

rutasErp.get('/dashboard/administracion/cables/nuevo', [authenticateUser, isAdmin], renderCnuevo)
rutasErp.get('/dashboard/administracion/cables/buscar', [authenticateUser, isAdmin], renderCbuscar)
rutasErp.get('/dashboard/administracion/cables/editar/:id', [authenticateUser, isAdmin], renderCeditar)

//?Facturas
rutasErp.get('/dashboard/administracion/facturas', [authenticateUser, isAdmin], renderFacturas)
rutasErp.get('/dashboard/administracion/facturas/nuevo', [authenticateUser, isAdmin], renderFacturar)
rutasErp.get('/dashboard/administracion/facturas/:id', [authenticateUser, isAdmin], verFactura)
rutasErp.get('/dashboard/administracion/facturas/ver/:id', renderTaxPdf)


//?Productos y Servicios
rutasErp.get('/dashboard/administracion/productos/buscar', [authenticateUser, isAdmin], renderProdBuscar)
rutasErp.get('/dashboard/administracion/productos/nuevo', [authenticateUser, isAdmin], renderProdNuevo)
rutasErp.get('/dashboard/administracion/productos/editar/:id', [authenticateUser, isAdmin], renderProdEditar)


//?llllllllllllllllllllllllllllll
//?Contabilidad Routes
//?llllllllllllllllllllllllllllll

//?Inversiones
rutasErp.get('/dashboard/contabilidad/inversiones/nuevo', [authenticateUser, isAdmin], renderCoNuevo)
rutasErp.get('/dashboard/contabilidad/inversiones/requerir', [authenticateUser, isAdmin], renderCoRequerir)
rutasErp.get('/dashboard/contabilidad/inversiones/buscar', [authenticateUser, isAdmin], renderCoBuscar)
rutasErp.get('/dashboard/contabilidad/inversiones/editar/:id', [authenticateUser, isAdmin], renderCoEditar)

//?Empleados
rutasErp.get('/dashboard/contabilidad/empleados/nuevo', [authenticateUser, isAdmin], renderEmNuevo)
rutasErp.get('/dashboard/contabilidad/empleados/asignar', [authenticateUser, isAdmin], renderEmAsignar)
rutasErp.get('/dashboard/contabilidad/empleados/buscar', [authenticateUser, isAdmin], renderEmBuscar)
rutasErp.get('/dashboard/contabilidad/empleados/todos', [authenticateUser, isAdmin], renderEmTodos)
rutasErp.get('/dashboard/contabilidad/empleados/:id', [authenticateUser, isAdmin], renderEmployee)
rutasErp.get('/dashboard/contabilidad/empleados/contrato/:id', [authenticateUser, isAdmin], renderContEmployee)
rutasErp.get('/dashboard/documento/:id', [authenticateUser, isAdmin], renderDoc)
rutasErp.get('/dashboard/documento/v/:id', [authenticateUser, isAdmin], renderDocV)
rutasErp.get('/dashboard/contabilidad/empleados/ver/contratos', [authenticateUser, isAdmin], renderContratos)
rutasErp.get('/signature/:id', authenticateSignature, renderSignature)
rutasErp.get('/dashboard/contabilidad/empleados/ver/contrato/:id', [authenticateUser, isAdmin], renderContrato)
rutasErp.get('/dashboard/contabilidad/empleados/contrato_pasado/:id', [authenticateUser, isAdmin], renderPastContrato)


//? Multiempresas
rutasErp.get('/dashboard/contabilidad/multiempresas/nuevo', [authenticateUser, isAdmin], renderNMultiempresas)
rutasErp.get('/dashboard/contabilidad/multiempresas/buscar', [authenticateUser, isAdmin], renderBMultiempresas)
rutasErp.get('/dashboard/contabilidad/multiempresas/editar/:id', [authenticateUser, isAdmin], renderEMultiempresas)

//?Jornadas
rutasErp.get('/dashboard/contabilidad/jornadas/ver', [authenticateUser, isAdmin], renderJornadas)



//? Bancos
rutasErp.get('/dashboard/contabilidad/bancos/cuentas/nuevo', [authenticateUser, isAdmin], renderBNuevo)
rutasErp.get('/dashboard/contabilidad/bancos/cuentas/buscar', [authenticateUser, isAdmin], renderBBuscar)
rutasErp.get('/dashboard/contabilidad/bancos/cuentas/editar/:id', [authenticateUser, isAdmin], renderBEditar)

//? Egresos
rutasErp.get('/dashboard/contabilidad/egresos/nuevo', [authenticateUser, isAdmin], renderEnuevos)
rutasErp.get('/dashboard/contabilidad/egresos/buscar', renderEbuscar)
rutasErp.get('/dashboard/contabilidad/egresos/editar/:id', [authenticateUser, isAdmin], renderEEditar)

//? Ingresos
rutasErp.get('/dashboard/contabilidad/ingresos/nuevo', [authenticateUser, isAdmin], renderInuevos)
rutasErp.get('/dashboard/contabilidad/ingresos/buscar', renderIngresosbuscar)
rutasErp.get('/dashboard/contabilidad/ingresos/editar/:id', [authenticateUser, isAdmin], renderIngresosEditar)


//! TESTING ROUTES
rutasErp.get('/testing/:id', async (req, res) => {
    const { id } = req.params
    const contract = await pool.query('SELECT * FROM CONTRATOS WHERE id = ?', [id])

    const contrato = contract[0][0]

    return res.render('contabilidad/empleados/contratoDoc', { contrato })
})

export default rutasErp;