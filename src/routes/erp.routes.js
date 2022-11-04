import { Router } from 'express';
import { renderEmployees, renderAnalytics, renderProyectos } from '../controllers/erp/analytics.controller.js';
import { renderUsuarios } from '../controllers/erp/inicio.controller.js';
import { renderOpNuevo } from '../controllers/erp/operacion.controller.js';
import { renderAdBuscar, renderAdNuevo, renderAdProvMarca, renderCliBuscar, renderCliNuevo, renderDCBuscar, renderDCNuevo, renderPBNuevo, renderPBBuscar } from '../controllers/erp/administracion.controller.js';
import { renderCoBuscar, renderCoNuevo, renderCoRequerir } from '../controllers/erp/contabilidad.controller.js';
import { authenticateUser } from '../middlewares/auth.js';
import { renderEmAsignar, renderEmBuscar, renderEmNuevo, renderEmTodos } from '../controllers/erp/contabilidad.controller.js'

const rutasErp = Router();
//?Home Route
/*
rutas.get('/dashboard/home', renderHome)
*/

//? Analytics routes
rutasErp.get('/dashboard/analytics/analytics', authenticateUser, renderAnalytics)
rutasErp.get('/dashboard/analytics/empleados', authenticateUser, renderEmployees)
rutasErp.get('/dashboard/analytics/proyectos', authenticateUser, renderProyectos)



//?Inicio Routes
rutasErp.get('/dashboard/inicio/usuarios', authenticateUser, renderUsuarios)
/*
rutas.get('/dashboard/inicio/respaldo', renderRespaldo)

//?llllllllllllllllllllllllllllll
//?Operación Routes
//?llllllllllllllllllllllllllllll

//*llllllllllllllllllllllll
//*Proyectos
//*llllllllllllllllllllllll
//? */

rutasErp.get('/dashboard/operacion/proyectos/nuevo', renderOpNuevo)
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
rutasErp.get('/dashboard/administracion/clientes/nuevo', renderCliNuevo)
rutasErp.get('/dashboard/administracion/clientes/buscar', renderCliBuscar)
/*
rutas.get('/dashboard/administracion/proveedores', render)
rutas.get('/dashboard/administracion/proveedores', render)

rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)
*/
rutasErp.get('/dashboard/administracion/marca/nuevo', renderAdNuevo)
rutasErp.get('/dashboard/administracion/marca/buscar', renderAdBuscar)
rutasErp.get('/dashboard/administracion/marca/prov_marca', renderAdProvMarca)

rutasErp.get('/dashboard/administracion/disciplina/nuevo', renderDCNuevo)
rutasErp.get('/dashboard/administracion/disciplina/buscar', renderDCBuscar)


rutasErp.get('/dashboard/administracion/proveedores/nuevo', renderPBNuevo)
rutasErp.get('/dashboard/administracion/proveedores/buscar', renderPBBuscar)

/*
rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)

*/

//?llllllllllllllllllllllllllllll
//?Contabilidad Routes
//?llllllllllllllllllllllllllllll

//?Inversiones
rutasErp.get('/dashboard/contabilidad/inversiones/nuevo', renderCoNuevo)
rutasErp.get('/dashboard/contabilidad/inversiones/requerir', renderCoRequerir)
rutasErp.get('/dashboard/contabilidad/inversiones/buscar', renderCoBuscar)


//?Empleados
rutasErp.get('/dashboard/contabilidad/empleados/nuevo', renderEmNuevo)
rutasErp.get('/dashboard/contabilidad/empleados/asignar', renderEmAsignar)
rutasErp.get('/dashboard/contabilidad/empleados/buscar', renderEmBuscar)
rutasErp.get('/dashboard/contabilidad/empleados/todos', renderEmTodos)

/*
//?llllllllllllllllllllllllllllll
//?Reportes Routes
//?llllllllllllllllllllllllllllll

*/

export default rutasErp;