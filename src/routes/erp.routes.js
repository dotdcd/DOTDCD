const { Router } = require('express');
const rutas = Router();
const {renderEmployees, renderAnalytics, renderProyectos} = require('../controllers/erp/analytics.controller')
const {renderUsuarios} = require('../controllers/erp/inicio.controller')
const {authenticateUser} = require('../middlewares/auth')
const {renderOpNuevo} = require('../controllers/erp/operacion.controller')

//?Home Route
/*
rutas.get('/dashboard/home', renderHome)
*/

//? Analytics routes
rutas.get('/dashboard/analytics/analytics', authenticateUser, renderAnalytics)
rutas.get('/dashboard/analytics/empleados', authenticateUser, renderEmployees)
rutas.get('/dashboard/analytics/proyectos', authenticateUser, renderProyectos)



//?Inicio Routes
rutas.get('/dashboard/inicio/usuarios', authenticateUser, renderUsuarios)
/*
rutas.get('/dashboard/inicio/respaldo', renderRespaldo)

//?llllllllllllllllllllllllllllll
//?Operación Routes
//?llllllllllllllllllllllllllllll

//*llllllllllllllllllllllll
//*Proyectos
//*llllllllllllllllllllllll
//? */

rutas.get('/dashboard/operacion/proyecto/nuevo', renderOpNuevo)
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



//?llllllllllllllllllllllllllllll
//?Administracion Routes
//?llllllllllllllllllllllllllllll
rutas.get('/dashboard/administracion/clientes/nuevo', renderCliNuevo)
rutas.get('/dashboard/administracion/clientes/buscar', renderCliBuscar)

rutas.get('/dashboard/administracion/proveedores', render)
rutas.get('/dashboard/administracion/proveedores', render)

rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)

rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)
rutas.get('/dashboard/administracion/', render)




//?llllllllllllllllllllllllllllll
//?Contabilidad Routes
//?llllllllllllllllllllllllllllll





//?llllllllllllllllllllllllllllll
//?Reportes Routes
//?llllllllllllllllllllllllllllll

*/

module.exports = rutas;