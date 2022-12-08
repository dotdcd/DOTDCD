import { Router } from 'express';
import {pool} from '../db.js';
import { read } from 'fs-extra';

//? Controllers
import { renderEmployees, renderAnalytics, renderProyectos } from '../controllers/erp/analytics.controller.js';
import { renderUsuarios } from '../controllers/erp/inicio.controller.js';
import { renderOpNuevo } from '../controllers/erp/operacion.controller.js';
import { renderAdBuscar, renderAdNuevo, renderAdProvMarca, renderCliBuscar, renderCliNuevo, renderDCBuscar, renderDCNuevo, renderPBNuevo, renderPBBuscar } from '../controllers/erp/administracion.controller.js';
import { renderCoBuscar, renderCoNuevo, renderCoRequerir } from '../controllers/erp/contabilidad.controller.js';
import { renderEmAsignar, renderEmBuscar, renderEmNuevo, renderEmTodos, renderEmployee, renderContEmployee, renderDoc, renderContratos, renderSignature, renderContrato, renderPastContrato } from '../controllers/erp/contabilidad.controller.js'
import {renderPrefacturar, renderMultiremision} from '../controllers/administracion/prefactura.controller.js'
//? Middlewares
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



//?Inicio Routes
rutasErp.get('/dashboard/inicio/usuarios', [authenticateUser, isAdmin], renderUsuarios)
/*
rutas.get('/dashboard/inicio/respaldo', renderRespaldo)

//?llllllllllllllllllllllllllllll
//?Operación Routes
//?llllllllllllllllllllllllllllll

//*llllllllllllllllllllllll
//*Proyectos
//*llllllllllllllllllllllll
//? */

rutasErp.get('/dashboard/operacion/proyectos/nuevo', [authenticateUser, isAdmin], renderOpNuevo)
/*
rutas.get('/dashboard/operacion/proyecto/control_cambios', renderOpControl)
rutas.get('/dashboard/operacion/proyecto/buscar', renderOpBuscar)
//?requisicion
rutas.get('/dashboard/operacion/proyecto/requisicion/nueva',renderReqNueva)
rutas.get('/dashboard/operacion/proyecto/requisicion/buscar',renderReqBuscar)
rutas.get('/dashboard/operacion/proyecto/requisicion/eliminar',renderReqEliminar)
//?operacion routes
rutas.get('/dashboard/operacion/proyecto/estimacion', renderOpEstimacion)
rutas.get('/dashboard/operacion/proyecto/asignar_empleados', renderOpEmpleados)
rutas.get('/dashboard/operacion/proyecto/reporte_cotizacion', renderOpCotizacion)
rutas.get('/dashboard/operacion/proyecto/autorizar', renderOpAutorizar)

//*lllllllllllllllllllllll
//*Autorizar
//*lllllllllllllllllllllll
//?Autorizar
rutas.get('/dashboard/operacion/autorizar/proyecto_cambios',render)


//*lllllllllllllllllllllll
//*SubContratos
//*lllllllllllllllllllllll
//?SubContratos
rutas.get('/dashboard/operacion/subcontratos/nuevo',renderSubNuevo)
rutas.get('/dashboard/operacion/subcontratos/buscar',renderSubBuscar)
rutas.get('/dashboard/operacion/subcontratos/ordenes_compra',renderSubOrdCompra)
rutas.get('/dashboard/operacion/subcontratos/estimaciones',renderSubEstimaciones)
rutas.get('/dashboard/operacion/subcontratos/pagos',renderSubPagos)
rutas.get('/dashboard/operacion/subcontratos/anticipos',renderSubAnticipos)

//*lllllllllllllllllllllll
//*Folios
//*lllllllllllllllllllllll
//?Folios
rutas.get('/dashboard/operacion/folios/nuevo', renderNuevo)
rutas.get('/dashboard/operacion/folios/pendientes', renderPendientes)
*/


//?llllllllllllllllllllllllllllll
//?Administracion Routes
//?llllllllllllllllllllllllllllll
rutasErp.get('/dashboard/administracion/clientes/nuevo', [authenticateUser, isAdmin], renderCliNuevo)
rutasErp.get('/dashboard/administracion/clientes/buscar', [authenticateUser, isAdmin], renderCliBuscar)
rutasErp.get('/dashboard/administracion/facturas/prefacturar', [authenticateUser, isAdmin], renderPrefacturar)
rutasErp.get('/dashboard/administracion/facturas/multiremision',[authenticateUser, isAdmin], renderMultiremision)
/*
rutas.get('/dashboard/administracion/proveedores', render)
rutas.get('/dashboard/administracion/proveedores', render)

rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)
*/
rutasErp.get('/dashboard/administracion/marca/nuevo', [authenticateUser, isAdmin], renderAdNuevo)
rutasErp.get('/dashboard/administracion/marca/buscar', [authenticateUser, isAdmin], renderAdBuscar)
rutasErp.get('/dashboard/administracion/marca/prov_marca', [authenticateUser, isAdmin], renderAdProvMarca)

rutasErp.get('/dashboard/administracion/disciplina/nuevo', [authenticateUser, isAdmin], renderDCNuevo)
rutasErp.get('/dashboard/administracion/disciplina/buscar', [authenticateUser, isAdmin], renderDCBuscar)


rutasErp.get('/dashboard/administracion/proveedores/nuevo', [authenticateUser, isAdmin], renderPBNuevo)
rutasErp.get('/dashboard/administracion/proveedores/buscar', [authenticateUser, isAdmin], renderPBBuscar)

/*
rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)

*/

//?llllllllllllllllllllllllllllll
//?Contabilidad Routes
//?llllllllllllllllllllllllllllll

//?Inversiones
rutasErp.get('/dashboard/contabilidad/inversiones/nuevo', [authenticateUser, isAdmin], renderCoNuevo)
rutasErp.get('/dashboard/contabilidad/inversiones/requerir', [authenticateUser, isAdmin], renderCoRequerir)
rutasErp.get('/dashboard/contabilidad/inversiones/buscar', [authenticateUser, isAdmin], renderCoBuscar)


//?Empleados
rutasErp.get('/dashboard/contabilidad/empleados/nuevo', [authenticateUser, isAdmin], renderEmNuevo)
rutasErp.get('/dashboard/contabilidad/empleados/asignar', [authenticateUser, isAdmin], renderEmAsignar)
rutasErp.get('/dashboard/contabilidad/empleados/buscar', [authenticateUser, isAdmin], renderEmBuscar)
rutasErp.get('/dashboard/contabilidad/empleados/todos', [authenticateUser, isAdmin], renderEmTodos)
rutasErp.get('/dashboard/contabilidad/empleados/:id', [authenticateUser, isAdmin], renderEmployee)
rutasErp.get('/dashboard/contabilidad/empleados/contrato/:id', [authenticateUser, isAdmin], renderContEmployee)
rutasErp.get('/dashboard/documento/:id', [authenticateUser, isAdmin], renderDoc)
rutasErp.get('/dashboard/contabilidad/empleados/ver/contratos', [authenticateUser, isAdmin], renderContratos)
rutasErp.get('/signature/:id', authenticateSignature, renderSignature)
rutasErp.get('/dashboard/contabilidad/empleados/ver/contrato/:id', [authenticateUser, isAdmin], renderContrato)
rutasErp.get('/dashboard/contabilidad/empleados/contrato_pasado/:id', [authenticateUser, isAdmin], renderPastContrato)

/*
//?llllllllllllllllllllllllllllll
//?Reportes Routes
//?llllllllllllllllllllllllllllll
*/

//! TESTING ROUTES
rutasErp.get('/testing/:id', async (req, res) => {
    const { id } = req.params
    const contract = await pool.query('SELECT * FROM CONTRATOS WHERE id = ?', [id])

    const contrato = contract[0][0]

    return res.render('contabilidad/empleados/contratoDoc', { contrato })
})

export default rutasErp;