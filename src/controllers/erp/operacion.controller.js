import { pool } from '../../db.js'
import axios from 'axios'



const getMoneda = async () => {
    const moneda = await pool.query("SELECT moneda_id, moneda_descripcion, moneda_cotizacion FROM monedas")
    return moneda[0]
}

const getSucursal = async () => {
    const sucursal = await pool.query("SELECT sucursal_id, sucursal_nombre FROM sucursal ORDER BY sucursal_nombre ASC")
    return sucursal[0]
}

const getEmpresa = async () => {
    const empresa = await pool.query("SELECT empresa_id, empresa_razon_social FROM multiempresa WHERE empresa_estatus_baja = 0 ORDER BY empresa_razon_social ASC")
    return empresa[0]
}

const getCliente = async () => {
    const cliente = await pool.query("SELECT cliente_id, cliente_razon_social FROM clientes WHERE cliente_razon_social IS NOT NULL AND cliente_razon_social <> '' ORDER BY cliente_razon_social ASC")
    return cliente[0]
}

const getEmpleado = async () => {
    const empleado = await pool.query("SELECT empleado_id, CONCAT(empleado_nombre, ' ', empleado_paterno, ' ', empleado_materno) as nombre_completo FROM empleados WHERE empleado_estatus_baja = 0 ORDER BY nombre_completo ASC")
    return empleado[0]

}
export const renderOpProyNuevo = async (req, res) => {

    try {
        const moneda = await getMoneda()
        const sucursales = await getSucursal()
        const empresaa = await getEmpresa()
        const clientes = await getCliente()
        const empleados = await getEmpleado()
        
        res.render('operacion/proyectos/nuevo', { clientes, sucursales, empresaa, moneda, empleados })
    } catch (error) {
        console.log(error)

    } 
}


const getCotizacionClase = async () => {
    const cotizacionClase = await pool.query("SELECT * FROM cotizaciones_clases")
    return cotizacionClase[0]
}

const getNiveles = async (id) => {
    const niveles = await pool.query("SELECT * FROM cotizaciones_niveles WHERE nivel_cotizacion_id = " + id)
    return niveles[0]
}

const getProdProyecto = async (id) => {
    const productos = await pool.query("SELECT cotizaciones_insumos.*, productos.*, marcas.*, COALESCE(tipos_material.tm_tipo, '- -') as tipo_material FROM cotizaciones_insumos LEFT JOIN productos ON cotizaciones_insumos.insumo_producto_id = productos.producto_id LEFT JOIN marcas ON productos.producto_marca_id = marcas.marca_id LEFT JOIN tipos_material ON productos.producto_material_tipo = tipos_material.tm_id WHERE cotizaciones_insumos.insumo_cotizacion_id =" + id)
    return productos[0]
}
const getTipos = async (id) => {
    const tipos = await pool.query("SELECT * FROM cotizaciones_tipos WHERE tipo_cotizacion_id =" + id)
    return tipos[0]
}

const getDisciplinaProy = async (id) => {
    const disciplina = await pool.query("SELECT * FROM cotizaciones_diciplinas WHERE diciplina_cotizacion_id = " + 111)
    return disciplina[0]
}


const getInsumos = async (disc, cot) => {
    const insumo = await pool.query("SELECT i.insumo_cotizacion_id, i.insumo_nivel_id, p.producto_descripcion as producto, p.producto_marca_id, m.marca_descripcion, tm.tm_tipo, p.producto_precio_tarjeta, i.insumo_cantidad, (i.insumo_cantidad * p.producto_precio_tarjeta) as importe, i.insumo_precio_mo, i.insumo_precio_ma, i.insumo_tipo_id FROM cotizaciones_insumos i INNER JOIN productos p ON p.producto_id = i.insumo_producto_id INNER JOIN marcas m ON p.producto_marca_id = m.marca_id INNER JOIN tipos_material tm ON p.producto_material_tipo = tm.tm_id WHERE i.insumo_cotizacion_id = "+cot+" AND i.insumo_diciplina_id = "+disc+" AND i.insumo_estatus_baja = 0")
    return insumo[0]
}

const getInsumosProy = async (id) => {
    const disciplina = await getDisciplinaProy(id)
    //console.log(disciplina)
    for (const d of disciplina) {
        const insumo = await getInsumos(d.diciplina_id, id)
        d['insumos'] = insumo
    }

    return disciplina
}

const productosSimple = async (id) => {
    
    const productos = await pool.query("SELECT producto_id, tarjeta_ma_costo, producto_moneda_id, producto_costo, insumo_orden, producto_descripcion, producto_modelo, marca_descripcion, insumo_diciplina_id, insumo_nivel_id, insumo_tipo_id, insumo_producto_id, insumo_cantidad, insumo_precio_ma, insumo_precio_mo, producto_precio_venta FROM cotizaciones_insumos JOIN productos ON insumo_producto_id = producto_id JOIN marcas ON producto_marca_id = marca_id WHERE insumo_cotizacion_id = " + id)
    
    let suma = []
    for (const p of productos[0]) {
        
        //console.log(p.producto_moneda_id, p.producto_costo, p.insumo_cantidad, p.insumo_cantidad * p.producto_costo)
        const costo = (p.producto_moneda_id == 1) ? p.insumo_precio_ma * p.insumo_cantidad : ((p.insumo_precio_ma * p.insumo_cantidad) * 21);
        suma.push(costo)
    }
    
    const total = suma.reduce((acc, curr) => acc + curr, 0).toFixed(2)
    console.log(total)
    return { productos: productos[0], total: total }
}
export const renderOpProyEditar = async (req, res) => {
    try {
        const moneda = await getMoneda()
        const sucursales = await getSucursal()
        const empresaa = await getEmpresa()
        const clientes = await getCliente()
        const empleados = await getEmpleado()
        const clase = await getCotizacionClase()
        const id = req.params.id
        const productos = await pool.query("SELECT producto_id, producto_codigo, producto_descripcion, producto_precio_tarjeta FROM productos LIMIT 1000")
        const proyecto = await pool.query("SELECT cotizacion_id, cotizacion_cliente_id, cotizacion_empleado_id, cotizacion_tipo_id, cotizacion_moneda_id, cotizacion_moneda_en_pesos,  cotizacion_contacto	, cotizacion_proyecto,cotizacion_descripcion,cotizacion_ubicacion,cotizacion_condiciones_comerciales,cotizacion_observaciones,  DATE_FORMAT(cotizacion_fecha_alta, '%Y-%m-%d') as cotizacion_fecha_alta, cotizacion_descuento_porcentaje,cotizacion_autorizada_estatus,  DATE_FORMAT(cotizacion_fecha_autorizada, '%Y-%m-%d') as cotizacion_fecha_autorizada, cotizacion_ultima_modificacion, cotizacion_estatus_baja,  DATE_FORMAT(cotizacion_fecha_baja, '%Y-%m-%d') as cotizacion_fecha_baja, cotizacion_forma, cotizacion_autorizador, cotizacion_arq_responsable, cotizacion_encargado, cotizacion_cobranza, cotizacion_contacto_obra,  cotizacion_centrodecostos_id, cotizacion_diciplina_nueva, cotizacion_hm_porcentaje, cotizacion_icampo_porcentaje,  cotizacion_ioficina_porcentaje	, cotizacion_financiamiento_porcentaje, cotizacion_utilidad_porcentaje, cotizacion_aditivas, cotizacion_deductivas,  cotizacion_extras, estimacion_firma1,estimacion_firma2,estimacion_firma3,estimacion_firma4,estimacion_firma5,estimacion_firma6,  estimacion_iva, cotizacion_compras_totalizadas, aut, baja,  DATE_FORMAT(recordatorio_fecha, '%Y-%m-%d') as recordatorio_fecha, recordatorio_periodo,  recordatorio_comentarios,  recordatorio_estatus_id, cancelacion_motivo_id, liquidada_sn,  DATE_FORMAT(fecha_inicio, '%Y-%m-%d') as fecha_inicio, DATE_FORMAT(fecha_termino, '%Y-%m-%d') as fecha_termino, siroc_sn, tel_cobranza, datos_cobranza	, pf, costo,  total, sucursal_id,cotizacion_empresa_id  FROM `cotizaciones` WHERE cotizacion_id = ?", [id])
        const p = proyecto[0][0]
        const producto = productos[0]
        const disciplinass = await getDisciplinaProy(id)
        const niveles = await getNiveles(id)
        const prodProyecto = await getProdProyecto(id)
        const tipos = await getTipos(id)
        const insumos = await getInsumosProy(id)
        const psimple = await productosSimple(id)
        res.render('operacion/proyectos/editar', { p, clientes, sucursales, empresaa, moneda, empleados, clase, producto, disciplinass, niveles, prodProyecto, tipos, insumos, psimple })
    } catch (error) {
        console.log(error)
    }
}
export const renderOpProyBuscar = async (req, res) => {
    try {
        let proyArr = []
        let proyArr2 = []
        const proyectos = await pool.query("SELECT c.cotizacion_id as cotizacion_id, cotizacion_cliente_id, cliente_razon_social,cotizacion_proyecto, CAST(cotizacion_fecha_alta AS DATE) as cotizacion_fecha_alta, CONCAT(cliente_razon_social, ' ', cotizacion_proyecto, ' ', cotizacion_fecha_alta) AS cotizacion_completa, CONCAT(e.empleado_nombre, ' ', e.empleado_paterno, ' ', e.empleado_materno) as nombre_completo, cotizacion_autorizada_estatus, cotizacion_estatus_baja, IFNULL(tablita_id, 0) as tablita_id,CONCAT(e2.empleado_nombre, ' ', e2.empleado_paterno, ' ', e2.empleado_materno) as usuario_creo FROM clientes JOIN cotizaciones c ON cliente_id = cotizacion_cliente_id  JOIN empleados e ON cotizacion_empleado_id = e.empleado_id LEFT JOIN tablita t ON t.cotizacion_id = c.cotizacion_id LEFT JOIN empleados e2 ON t.usuario_modifico = e2.empleado_id  ORDER BY cotizacion_id DESC LIMIT 2000")
        for (const p of proyectos[0]) {
            const cstatus = (p.cotizacion_estatus_baja == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            const cautorizada = (p.cotizacion_autorizada_estatus == 1) ? "<span class='badge badge-success badge-pill'>Autorizada</span>" : (p.cotizacion_autorizada_estatus == 0) ? "<span class='badge badge-secondary badge-pill'>Cotizada</span>" : (p.cotizacion_autorizada_estatus == 2) ? "<span class='badge badge-info badge-pill'>Terminada</span>" : (p.cotizacion_autorizada_estatus == 9) ? "<span class='badge badge-primary badge-pill'>Poliza</span>" : "<span class='badge badge-danger badge-pill'>No Autorizada</span>"
            proyArr.push([p.cotizacion_id, p.cliente_razon_social, p.cotizacion_fecha_alta, p.cotizacion_proyecto, p.nombre_completo, cstatus, cautorizada, '<center> <a href="/dashboard/operacion/proyectos/editar/' + p.cotizacion_id + '" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a></div> <form method="post" action="/delProyecto/' + p.cotizacion_id + '"><button type="submit" class="btn btn-lg btn-outline-danger" ><i class="fal fa-light fa-circle-minus"></i></button></form></div></div> </center>'])
            proyArr2.push([p.cotizacion_id, p.cliente_razon_social, '<input type="checkbox"  value="'+p.cotizacion_id+'" class="form-control">'])
        }

        res.render('operacion/proyectos/buscar', { proyArr, proyArr2 })
    } catch (error) {
        console.log(error)
    }
}


//? Render Requisiciones
export const renderOpReqBuscar = async (req, res) => {
    try {
        const rqc = await pool.query("SELECT r.requisicion_id as id, COALESCE(r.requisicion_id_remplazada, ' ') as requisicion_id_remplazada, r.requisicion_comentarios as comentarios, c.cotizacion_descripcion as cotizacion, CONCAT(e.empleado_nombre, ' ', e.empleado_paterno, ' ', e.empleado_materno) as empleado, COALESCE(DATE_FORMAT(r.requisicion_fecha, '%Y-%m-%d'), 'sin fecha registrada') as fecha, rt.requisicion_tipo_descripcion as tipo FROM requisiciones r INNER JOIN cotizaciones c ON c.cotizacion_id = r.requisicion_cotizacion_id INNER JOIN empleados e ON e.empleado_id = r.requisicion_empleado_id INNER JOIN requisiciones_tipos rt ON r.tipo_id = rt.requisicion_tipo_id ORDER BY r.requisicion_id DESC LIMIT 1500")
        let requisiciones = []
        for (const r of rqc[0]) {
            requisiciones.push([r.id, r.comentarios, r.cotizacion, r.empleado, r.fecha, r.tipo, r.requisicion_id_remplazada, '<center><a href="/dashboard/operacion/requerimientos/editar/' + r.id + '" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a>  <button type="button" class="btn btn-lg btn-outline-danger" onClick="delRequisicion(' + r.id + ')"><i class="fal fa-trash-alt"></i></button></center>'])
        }
        requisiciones.reverse()
        res.render('operacion/proyectos/requisiciones/buscar', { requisiciones })
    } catch (error) {
        console.log(error)
    }
}

const getRequisiciones = async () => {
    const requisiciones = await pool.query("SELECT requisicion_id, requisicion_comentarios FROM requisiciones WHERE requisicion_comentarios != '' ORDER BY requisicion_id DESC")
    return requisiciones[0]
}

export const renderOpReqNuevo = async (req, res) => {
    try {
        const clientes = await getClientes()
        const requisiciones = await getRequisiciones()
        const cotizaciones = await getCotizaciones()
        const inversion = await getInversion()
        const familias = await getFamilias()
        const empleados = await getEmpleados()

        res.render('operacion/proyectos/requisiciones/nuevo', { clientes, requisiciones, cotizaciones, inversion, familias, empleados })
    } catch (error) {
        console.log(error)
    }
}

const getClientes = async () => {
    const clientes = await pool.query("SELECT cliente_id, cliente_razon_social FROM clientes")
    return clientes[0]
}
const getEmpleados = async () => {
    const empleados = await pool.query("SELECT empleado_id, CONCAT(empleado_nombre, ' ', empleado_paterno, ' ', empleado_materno) as nombre_completo FROM empleados WHERE empleado_estatus_baja = 0")
    return empleados[0]
}
const getCotizaciones = async () => {
    const cotizaciones = await pool.query("SELECT cotizacion_id, cotizacion_descripcion FROM cotizaciones WHERE cotizacion_estatus_baja = 0 AND cotizacion_descripcion IS NOT NULL AND cotizacion_descripcion != ''")
    return cotizaciones[0]
}
const getEmpresas = async () => {
    const empresas = await pool.query("SELECT empresa_id, empresa_razon_social FROM multiempresa")
    return empresas[0]
}
const getInversion = async () => {
    const inversion = await pool.query("SELECT inversion_id, inversion_descripcion FROM inversiones")
    return inversion[0]
}

const getFamilias = async () => {
    const familias = await pool.query("SELECT familia_id, familia_descripcion FROM familias")
    return familias[0]
}

const getRequisicion = async (id) => {
    const requisicion = await pool.query("SELECT requisiciones.requisicion_id, requisiciones.tipo_id, requisiciones.requisicion_comentarios, requisiciones.requisicion_cotizacion_id, requisiciones.requisicion_diciplina_id, requisiciones.requisicion_empleado_id, requisiciones.requisicion_empleado_id, DATE_FORMAT(IFNULL(requisiciones.requisicion_fecha, ''), '%Y-%m-%d') as fecha, familias.familia_descripcion, cotizaciones.cotizacion_id, cotizaciones.cotizacion_proyecto, CONCAT(empleados.empleado_nombre, ' ', empleados.empleado_paterno, ' ', empleados.empleado_materno) as nombre_completo, requisicion_inversion_id  FROM requisiciones INNER JOIN familias ON requisiciones.requisicion_diciplina_id = familias.familia_id INNER JOIN cotizaciones ON requisiciones.requisicion_cotizacion_id = cotizaciones.cotizacion_id INNER JOIN empleados ON requisiciones.requisicion_empleado_id = empleados.empleado_id WHERE requisiciones.requisicion_id = ? ", [id])
    return requisicion[0][0]
}

const getInfo = async (id) => {
    id = parseInt(id);
    const cliente = await pool.query("SELECT clientes.cliente_razon_social FROM cotizaciones INNER JOIN clientes ON cotizaciones.cotizacion_cliente_id = clientes.cliente_id WHERE cotizaciones.cotizacion_id = ?" , [id])
    return cliente[0][0]
} 

const getCcliente = async (id) => {
    const cliente = await pool.query("SELECT clientes.cliente_razon_social FROM cotizaciones INNER JOIN clientes ON cotizaciones.cotizacion_cliente_id = clientes.cliente_id WHERE cotizaciones.cotizacion_id = ?" , [id])
    return cliente[0][0]
}

const getLista = async (id) => { 
    const lista = await pool.query("SELECT producto_descripcion, marca_descripcion, partida_requisicion_id, partida_producto_id, partida_cantidad, partida_ultimamodificacion, producto_modelo, partida_cantidad as requerido ,  CASE  WHEN ocd.orden_fecha_entrega IS NULL THEN 'sin fecha registrada'  ELSE LEFT (ocd.orden_fecha_entrega, 10)  END AS orden_fecha_entrega,  ifnull(oc.orden_id, 0) as orden_id  FROM requisiciones_partidas  JOIN productos ON producto_id = partida_producto_id  JOIN marcas ON marca_id = producto_marca_id  LEFT JOIN ordenes_compra oc ON oc.orden_requisicion_id = partida_requisicion_id  LEFT JOIN ordenes_compra_detalle ocd ON ocd.detalle_orden_id = oc.orden_id AND ocd.detalle_producto_id = partida_producto_id  WHERE partida_requisicion_id ="+id+"  ORDER BY partida_oden")
        return lista[0]
}

export const renderOpReqEditar = async (req, res) => {
    try {
        const { id } = req.params.id
        const clientes = await getClientes()
        const empleados = await getEmpleados()
        const cotizaciones = await getCotizaciones()
        const empresas = await getEmpresas()
        const inversion = await getInversion()
        const familias = await getFamilias()
        const r = await getRequisicion(req.params.id)
        const clienteA = await getCcliente(id)
        const info = await getInfo(req.params.id)
        const lista = await getLista(req.params.id)
        return res.render('operacion/proyectos/requisiciones/editar', { clientes, empleados, cotizaciones, empresas, inversion, familias, r, clienteA, info, lista })
    } catch (error) {
        console.log(error)
    }
}

//! Render Requisiciones

//? render proyecto atuorizado


export const renderOpProyAutorizar = async (req, res) => {
    try {
        let cotizaciones = []
        const proyectos = await pool.query("SELECT c.cotizacion_id as cotizacion_id, cotizacion_cliente_id, cliente_razon_social,cotizacion_proyecto, CAST(cotizacion_fecha_alta AS DATE) as cotizacion_fecha_alta, CONCAT(cliente_razon_social, ' ', cotizacion_proyecto, ' ', cotizacion_fecha_alta) AS cotizacion_completa, CONCAT(e.empleado_nombre, ' ', e.empleado_paterno, ' ', e.empleado_materno) as nombre_completo, cotizacion_autorizada_estatus, cotizacion_estatus_baja, IFNULL(tablita_id, 0) as tablita_id,CONCAT(e2.empleado_nombre, ' ', e2.empleado_paterno, ' ', e2.empleado_materno) as usuario_creo FROM clientes JOIN cotizaciones c ON cliente_id = cotizacion_cliente_id  JOIN empleados e ON cotizacion_empleado_id = e.empleado_id LEFT JOIN tablita t ON t.cotizacion_id = c.cotizacion_id LEFT JOIN empleados e2 ON t.usuario_modifico = e2.empleado_id  ORDER BY cotizacion_id DESC LIMIT 500")
        for (const p of proyectos[0]) {
            const cstatus = (p.cotizacion_estatus_baja == 0) ? "<span class='badge badge-success badge-pill'>Activo</span>" : "<span class='badge badge-danger badge-pill' >Inactivo</span>"
            const cautorizada = (p.cotizacion_autorizada_estatus == 1) ? "<span class='badge badge-success badge-pill'>Autorizada</span>" : (p.cotizacion_autorizada_estatus == 0) ? "<span class='badge badge-secondary badge-pill'>Cotizada</span>" : (p.cotizacion_autorizada_estatus == 2) ? "<span class='badge badge-info badge-pill'>Terminada</span>" : (p.cotizacion_autorizada_estatus == 9) ? "<span class='badge badge-primary badge-pill'>Poliza</span>" : "<span class='badge badge-danger badge-pill'>No Autorizada</span>"
            cotizaciones.push([p.cotizacion_id, p.cliente_razon_social, p.cotizacion_fecha_alta, p.cotizacion_proyecto, p.nombre_completo, cstatus, cautorizada, '<center><a href="/dashboard/operacion/proyectos/autorizar/' + p.cotizacion_id + '" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a>  <form method="post" action="/delAutorizacion/' + p.cotizacion_id + '"><button type="submit" class="btn btn-lg btn-outline-danger"><i class="fal fa-light fa-circle-minus"></i></button></form></center>'])
        }

        res.render('operacion/proyectos/autorizar', { cotizaciones })
    } catch (error) {
        console.log(error)
    }
}


const getProyecto = async (id) => {
    const proyecto = await pool.query("SELECT cotizacion_id, cotizacion_cliente_id, cotizacion_proyecto, cotizacion_fecha_alta, cotizacion_empleado_id, cotizacion_autorizada_estatus, cotizacion_estatus_baja, recordatorio_comentarios FROM cotizaciones WHERE cotizacion_id = ?", [id])
    return proyecto[0][0]
}

const getCentrodeCostos = async () => {
    const centrodecostos = await pool.query("SELECT centrodecostos_id, centrodecostos_descripcion FROM centrodecostos")
    return centrodecostos[0]
}
const getFacturado = async (id) => {
    const facturado = await pool.query("SELECT factura_id, factura_total, factura_moneda_id FROM facturas WHERE factura_proyecto_id = ?", [id])
    if (facturado[0].length == 0) {
        return { factura_id: 0, factura_total: '0', factura_moneda_id: 1 }
    }
    return facturado[0][0]
}

const cobrado = async (id) => {
    const cobrado = await pool.query("SELECT pago_monto AS cobrado, factura_moneda_id FROM facturas_pagos JOIN facturas ON factura_id = pago_factura_id WHERE factura_proyecto_id = " + id)
    if (cobrado[0].length == 0) {
        return { cobrado: 0, factura_moneda_id: 1 }
    }
    return cobrado[0][0]
}
const getComprado = async (id) => {
    const comprado = await pool.query("select cheque_id, cheque_fecha_alta, banco_cuenta_moneda_id, cheque_monto,  COALESCE(pago_monto_moneda_cheque, 0) AS pago_orden, COALESCE(cheque_comentario, '') as cheque_comentario, COALESCE(P.proveedor_razon_social, '') as proveedor_razon_social_orden, COALESCE(C.proveedor_razon_social, '') as proveedor_razon_social_cheque FROM cheques LEFT JOIN proveedores as C ON C.proveedor_id = cheque_proveedor_id LEFT JOIN ordenes_compra_pagos ON pago_cheque_id = cheque_id LEFT JOIN ordenes_compra ON orden_id = pago_orden_id LEFT JOIN proveedores as P ON P.proveedor_id = orden_proveedor_id LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id WHERE cheque_ingreso <> '1' AND cheque_estatus_baja = 0 AND (COALESCE(orden_cotizacion_id, 0) = " + id + " OR COALESCE(cheque_cotizacion_id, 0) = " + id + " OR COALESCE(requisicion_cotizacion_id, 0) = " + id + ")	ORDER BY cheque_id")
    if (comprado[0].length == 0) {
        return 0
    }
    return comprado[0][0]
}
export const renderOpProyAutorizarProyecto = async (req, res) => {
    try {
        const centroCostos = await getCentrodeCostos()
        const moneda = await getMoneda()
        const sucursales = await getSucursal()
        const empresaa = await getEmpresa()
        const clientes = await getCliente()
        const empleados = await getEmpleado()
        const clase = await getCotizacionClase()
        const { id } = req.params
        const facturado = await getFacturado(id)
        const comprado = await getComprado(id)
        const proyecto = await pool.query("SELECT cotizacion_id, cotizacion_cliente_id,cotizacion_moneda_id, cotizacion_contacto, cotizacion_autorizador, cotizacion_responsable, cotizacion_empleado_id, cotizacion_proyecto, cotizacion_forma, cotizacion_centrodecostos_id, cotizacion_autorizada_estatus, cotizacion_fecha_autorizada, cotizacion_cobranza, cotizacion_contacto_obra,cotizacion_arq_responsable, cotizacion_encargado, cotizacion_ultima_modificacion, cotizacion_estatus_baja, IFNULL(liquidada_sn, 0) as liquidada_sn, fecha_inicio, fecha_termino, siroc_sn, tel_cobranza, datos_cobranza, pf, costo, total, sucursal_id, cotizacion_moneda_id FROM cotizaciones WHERE cotizacion_id = " + [id] + " order by cotizacion_encargado asc")
        const cotizaciones = await pool.query("SELECT cotizacion_id, cotizacion_proyecto, cotizacion_cliente_id FROM cotizaciones WHERE cotizacion_cliente_id = " + proyecto[0][0].cotizacion_cliente_id)
        const fechas = await pool.query("SELECT DATE_FORMAT(fecha_inicio, '%Y-%m-%d') AS fecha_inicio, DATE_FORMAT(fecha_termino, '%Y-%m-%d') AS fecha_termino, DATE_FORMAT(cotizacion_fecha_autorizada, '%Y-%m-%d') AS cotizacion_fecha_autorizada FROM cotizaciones WHERE cotizacion_id = ?", [id])
        const p = proyecto[0][0]
        const f = fechas[0][0]
        const pcobrado = await cobrado(id)
        const cotizacion = cotizaciones[0]

        
        res.render('operacion/proyectos/autorizarEditar', { f, p, clientes, sucursales, empresaa, moneda, empleados, clase, centroCostos, cotizacion, facturado, pcobrado, comprado })
    } catch (error) {
        console.log(error)
    }
}


export const renderFolioNuevo = async (req, res) => {
    const clientess = await getCli()
    const empleados = await getEmpleados()
    const centroCostos = await getCentrodeCostos()

    res.render('operacion/folios/nuevo', { clientess, empleados, centroCostos })
}

export const renderFolioEditar = async (req, res) => {
    const { id } = req.params
    const clientess = await getCli()
    const empleados = await getEmpleados()
    const centroCostos = await getCentrodeCostos()
    const folio = await pool.query("SELECT * FROM folios WHERE folio_id = ?", [id])
    const f = folio[0][0]
    res.render('operacion/folios/editar', { f, clientess, empleados, centroCostos})
}
const getCli = async () => {
    const cliente = await pool.query("SELECT cliente_id, cliente_razon_social FROM clientes")
    return cliente[0]
}







export const renderFolioBuscar = async (req, res) => {

    try {
        const folio = await pool.query("SELECT f.folio_id as id, c.cliente_razon_social, DATE_FORMAT(f.folio_fecha_alta, '%Y-%m-%d') as fecha, CONCAT(e.empleado_nombre, ' ', e.empleado_paterno) as empleado, f.folio_descripcion as descripcion, f.folio_estatus_baja as estatus FROM folios f INNER JOIN clientes c ON c.cliente_id = f.folio_cliente_id INNER JOIN empleados e ON e.empleado_id = f.folio_empleado_id ORDER BY f.folio_id DESC")
        let folios = []
        const f = folio[0]
        for (const fol of f) {
            var  cstatus = (fol.estatus == 1) ? "<span class='badge badge-danger badge-pill' >Inactivo</span>" : "<span class='badge badge-success badge-pill'>Activo</span>"
            folios.push([fol.id, fol.cliente_razon_social, fol.fecha, fol.descripcion, fol.empleado, cstatus, '<center><a href="/dashboard/operacion/folios/editar/' + fol.id + '" class="btn btn-lg btn-outline-success m-1" "><i class="fal fa-sync"></i></a>  <form method="post" action="/delFolio/' + fol.id + '"><button class="btn btn-lg btn-outline-danger m-1" ><i class="fal fa-trash"></i></button></form></center>'])
        }
        res.render('operacion/folios/buscar', { f, folios})
    } catch (error) {
        console.log(error)
    }
}

