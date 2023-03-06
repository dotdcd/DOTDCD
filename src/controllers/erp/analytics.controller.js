import {pool} from '../../db.js'
import {colors} from '../../helpers/colors.js'
import axios from 'axios'

//* RENDER Employees

//? Get Total num of employees function
export const getTotal = async () => {
    const numE = await pool.query("Select count(*) as num from empleados where empleado_estatus_baja = 0")
    return numE[0][0]['num']
}

//? Get all employees function (only active employees)
const getEmpleados = async () => {
    try {
        let emp = []
        const employees = await pool.query("SELECT empleados.empleado_nombre AS nombre, empleados.empleado_paterno AS apellido_paterno, empleados.empleado_materno AS apellido_materno, empleado_tipo_indirecto.tipo_indirecto_nombre AS tipo_indirecto, puestos.puesto_descripcion AS puesto, sucursal.sucursal_nombre AS sucursal FROM empleados INNER JOIN empleado_tipo_indirecto ON empleados.tipo_indirecto_id = empleado_tipo_indirecto.tipo_indirecto_id INNER JOIN puestos ON empleados.empleado_puesto_id = puestos.puesto_id INNER JOIN sucursal ON empleados.sucursal_id = sucursal.sucursal_id WHERE empleados.empleado_estatus_baja = 0");

        employees[0].forEach(e => {
            emp.push([e.nombre, e.apellido_paterno, e.apellido_materno, e.tipo_indirecto, e.puesto, e.sucursal])
        });
        return emp;
    } catch (error) {
        return error;
    }
}

//? Get active employees for type
const getEmpType = async () => {
    try {
        let employees = []
        const numE = await getTotal()
        const result = await pool.query("SELECT empleado_tipo_indirecto.tipo_indirecto_nombre AS tipo, (SELECT COUNT(empleados.tipo_indirecto_id) FROM empleados WHERE empleados.empleado_estatus_baja = 0 AND empleados.tipo_indirecto_id = empleado_tipo_indirecto.tipo_indirecto_id) AS num FROM empleado_tipo_indirecto ORDER BY num DESC")

        result[0].forEach(e => {
            if (e.num > 0) {
                const p = ((e.num * 100) / numE)
                const percent = Math.ceil(p)

                employees.push({ tipo: e.tipo, num: e.num, percent: percent })
            }
        });

        for (let i = 0; i < employees.length; i++) {
            employees[i].color = colors[i].color
        }

        return employees
    } catch (error) {
        return error
    }
}

const getEmpSuc = async () => {

    try {
        let employees = []
        const numE = await getTotal()
        const result = await pool.query("SELECT sucursal.sucursal_nombre AS sucursal, (SELECT COUNT(empleados.sucursal_id) FROM empleados WHERE empleados.empleado_estatus_baja = 0 AND empleados.sucursal_id = sucursal.sucursal_id) AS num FROM sucursal ORDER BY num DESC")

        result[0].forEach(e => {
            if (e.num > 0) {
                const p = ((e.num * 100) / numE)
                const percent = Math.ceil(p)

                employees.push({ sucursal: e.sucursal, num: e.num, percent: percent })
            }
        });

        for (let i = 0; i < employees.length; i++) {
            employees[i].color = colors[i].color
        }

        return employees;
    } catch (error) {
        return error
    }
}

const getSucursalEmp = async (id) => {
    try {
        let employees = []

        const resultN = await pool.query("SELECT COUNT(*) AS num FROM empleados WHERE sucursal_id = " + id + " AND empleado_estatus_baja = 0")

        const resultE = await pool.query("SELECT empleado_tipo_indirecto.tipo_indirecto_nombre AS tipo, (SELECT COUNT(*) FROM empleados WHERE empleados.empleado_estatus_baja = 0 AND empleados.tipo_indirecto_id = empleado_tipo_indirecto.tipo_indirecto_id AND empleados.sucursal_id = "+id+") AS num FROM empleado_tipo_indirecto ORDER BY num DESC")

        resultE[0].forEach(e => {
            if (e.num > 0) {
                const p = ((e.num * 100) / resultN[0][0].num)
                const percent = Math.ceil(p)

                employees.push({ tipo: e.tipo, num: e.num, percent: percent })
            }
        });

        for (let i = 0; i < employees.length; i++) {
            employees[i].color = colors[i].color
        }

        return {data: employees, total: resultN[0][0].num}
    } catch (error) {
        return error
    }
}

const getEmpForSuc = async () => {
    try {
        const sucursales = await pool.query("SELECT sucursal_id AS id, sucursal_nombre AS nombre FROM sucursal")

        let empSuc = []

        for (const sucursal of sucursales[0]) {
            const employees = await getSucursalEmp(sucursal.id)

                if(employees.data.length > 0) empSuc.push({id: sucursal.id, sucursal: sucursal.nombre, data: employees.data, total: employees.total})
            }

            return empSuc
        } catch (error) {
            return error
        }
    }

    //? Get active employees for mob role
    const getEmpMob = async () => {
        try {
            let employees = []
            const numE = await pool.query("SELECT SUM(num) AS sum FROM (SELECT empleado_tipo_indirecto.tipo_indirecto_nombre AS tipo, (SELECT COUNT(*) FROM empleados WHERE empleados.empleado_estatus_baja = 0 AND empleados.tipo_indirecto_id = empleado_tipo_indirecto.tipo_indirecto_id AND empleados.sucursal_id = 1) AS num FROM empleado_tipo_indirecto WHERE empleado_tipo_indirecto.tipo_indirecto_nombre LIKE 'Depas%') AS ins")
            const result = await pool.query("SELECT empleado_tipo_indirecto.tipo_indirecto_nombre AS tipo, (SELECT COUNT(*) FROM empleados WHERE empleados.empleado_estatus_baja = 0 AND empleados.tipo_indirecto_id = empleado_tipo_indirecto.tipo_indirecto_id AND empleados.sucursal_id = 1) AS num FROM empleado_tipo_indirecto WHERE empleado_tipo_indirecto.tipo_indirecto_nombre LIKE 'Depas%' ORDER BY num DESC")

            result[0].forEach(e => {
                if (e.num > 0) {
                    const p = ((e.num * 100) / numE[0][0].sum)
                    const percent = Math.ceil(p)

                    employees.push({ tipo: e.tipo, num: e.num, percent: percent })
                }
            });

            for (let i = 0; i < employees.length; i++) {
                employees[i].color = colors[i].color
            }


            return employees
        } catch (error) {
            return error
        }
    }

    export const renderEmployees = async (req, res) => {

        const employees = await getEmpleados()
        const empType = await getEmpType()
        const empSuc = await getEmpSuc()
        const sucEmployees = await getEmpForSuc()
        const empMob = await getEmpMob()

        const sucs = sucEmployees.sort(function (a, b){
            if(a.total > b.total){
                return 1
            }
            if(a.total < b.total){
                return -1
            }

            return 0
        })

        const orderSuc = sucs.reverse()
        
        res.render('analytics/empleados', {employees, empType, empSuc, orderSuc, empMob})
    }
    //! End Employees


    //* Render Analytics
    //? Get total of office price
    const getMonto = async () => {
        try {
            const mme = {}
            const nCampo = await pool.query("SELECT SUM(empleado_sueldo) AS sum FROM empleados WHERE tipo_indirecto_id IN(2, 3, 14, 18) AND empleado_estatus_baja = 0")
            mme.minimo = Math.round((nCampo[0][0].sum * 3) * 2)
            mme.media = Math.round(mme.minimo * 1.5)
            mme.esperado = Math.round(mme.minimo * 2)

            return mme
        } catch (error) {
            return (error)
        }
    }

    //? Get dates 
    const getDates = async () => {
        try {
            const hoy = new Date()
            const startYear = hoy.getFullYear() - 1
            const endYear = hoy.getFullYear()
            const month1 = hoy.getMonth() + 1
            const dates = [];

            for (let i = startYear; i <= endYear; i++) {
                const endMonth = i != endYear ? 11 : month1 - 1;
                const startMon = i === startYear ? month1 - 1 : 0;
                for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
                    const month = j + 1;
                    const displayMonth = month < 10 ? '0' + month : month;
                    dates.push({ y: i, m: displayMonth });
                }
            }
            
            return dates.reverse();
        } catch (error) {
            console.log(error)
        }
    }

    //? Get solds for each month
    const getVentas = async (dates) => {
        try {
            let ventas = []
            for (const date of dates) {
                const venta = await pool.query("SELECT ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT ROUND(SUM((total/1.16)), 2) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND MONTH(cotizacion_fecha_autorizada) = "+date.m+" AND YEAR(cotizacion_fecha_autorizada) = "+date.y+" ) AS pesos, (SELECT IFNULL((SUM((IFNULL(total, 0)/1.16))*21), 0) as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND MONTH(cotizacion_fecha_autorizada) = "+date.m+" AND YEAR(cotizacion_fecha_autorizada) = "+date.y+" ) AS usd ")
                if(venta[0][0].total == null) ventas.push({total: 0})
                else ventas.push({total: venta[0][0].total})
            }
            return ventas
        } catch (error) {
            console.log(error)
        }
    }

    //? get quotes for each month
    const getCotizaciones = async (dates) => {
        try {
            let cotizaciones = []
            for (const date of dates) {
                const cotizacion = await pool.query("SELECT ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT IFNULL((SUM((IFNULL(total, 0)/1.16))), 0) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND pf > 0 AND MONTH(cotizacion_fecha_alta) = "+date.m+" AND YEAR(cotizacion_fecha_alta) = "+date.y+" ) AS pesos, (SELECT IFNULL((SUM((IFNULL(total, 0)/1.16))*21), 0) as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND pf > 0 AND MONTH(cotizacion_fecha_alta) = "+date.m+" AND YEAR(cotizacion_fecha_alta) = "+date.y+" ) AS usd")
                if(cotizacion[0][0].total == null) cotizaciones.push({total: 0})
                else cotizaciones.push({total: cotizacion[0][0].total})
            }
            
            return cotizaciones
        } catch (error) {
            console.log(error)
        }
    }

    //? Get bills for each month
    const getFacturas = async (dates) => {
        try {
            let facturas = []
            for (const date of dates){
                const factura = await pool.query("SELECT ROUND(SUM(IF(factura_moneda_id = 2, factura_subtotal * 20, factura_subtotal)), 2) as total FROM facturas WHERE MONTH(factura_fecha_alta) = "+date.m+" AND YEAR(factura_fecha_alta) = "+date.y+" AND factura_estatus_baja = 1 AND NOT factura_cliente_id IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND factura_empresa_id IN (3, 15, 16, 17, 18)")
                if(factura[0][0].total == null) facturas.push({total: 0})
                else facturas.push({total: factura[0][0].total})
            }

            return facturas
        } catch (error) {
            console.log(error)
        }
    }

    //? Get earnings for each month
    const getIngresos = async (dates) => {
        try {

            let ingresos = []
            for (const date of dates) {
                const ingreso = await pool.query("SELECT ROUND(SUM(IF(cheque_saldo = 20, (cheque_saldo * cheque_subtotal), cheque_subtotal)), 2) as total FROM cheques WHERE cheque_comentario NOT LIKE '%Dol%' AND cheque_comentario NOT LIKE '%DEV%' AND cheque_comentario NOT LIKE '%dlls%' AND cheque_estatus_baja = 0 AND cheque_ingreso = 1 AND cheque_cliente_id NOT IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND cheque_empresa_id IN (3, 15, 16, 17, 18) AND YEAR(cheque_fecha_alta) = "+date.y+" AND MONTH(cheque_fecha_alta) = "+date.m+"")
                if(ingreso[0][0].total == null) ingresos.push({total: 0})
                else ingresos.push({total: ingreso[0][0].total})
            }

            return ingresos
        } catch (error) {
            console.log(error)
        }
    }

    //? Calculate goals for each month
    const calMetas = async (date, minimo) => {
        try {
        const y = date.y - 1
        const mc = await pool.query("SELECT ROUND(total/totalv, 2) as mc FROM (SELECT ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT ROUND(SUM((total/1.16) * (pf/100)), 2) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS pesos, (SELECT ROUND(SUM((total/1.16) * (pf/100)), 2)*21 as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS usd) as t, (SELECT ROUND(SUM(pesos+usd), 2) AS totalv FROM (SELECT ROUND(SUM((total/1.16)), 2) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS pesos, (SELECT ROUND(SUM((total/1.16)), 2)*21 as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS usd) as tt")
        const pb = await pool.query("SELECT ROUND(ventas / cotizaciones, 2) as pb FROM (SELECT ROUND(SUM(total), 2) AS cotizaciones FROM cotizaciones WHERE pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31')B, (SELECT ROUND(SUM(total), 2) AS ventas FROM cotizaciones WHERE cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND cotizacion_fecha_autorizada BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31')A")

        const mcr = (mc[0][0].mc == null) ? 1 : mc[0][0].mc
        const pbr = (pb[0][0].pb == null) ? 1 : pb[0][0].pb

        const metas = {
            mc: {
                minimo: Math.round(minimo/mcr),
                media: Math.round((minimo/mcr) * 1.5),
                esperado: Math.round((minimo/mcr) * 2)
            },
            pb: {
                minimo: Math.round(minimo/pbr),
                media: Math.round((minimo/pbr) * 1.5),
                esperado: Math.round((minimo/pbr) * 2)
            }
        }

        return metas

    } catch (error) {
        console.log(error)
    }
}

//? Get goals for each month
const getMetas = async (dates, minimo) => {
    try {
        let metas = []
        for (const date of dates) {
            const mts = await calMetas(date, minimo)
            metas.push(mts)   
        }

        return metas
    } catch (error) {
        console.log(error)
    }
}
const getPercentBill = async (id, total) => {
    try {
        const dates = await getDates()
        const bills = []
        for (const date of dates) {
            const ingreso = await pool.query("SELECT ROUND(SUM(fp.pago_monto_moneda_cheque), 2) as total FROM facturas_pagos fp INNER JOIN facturas f ON f.factura_id = fp.pago_factura_id INNER JOIN cheques c ON c.cheque_id = fp.pago_cheque_id WHERE f.sucursal_id = "+id+" AND YEAR(c.cheque_fecha_alta) = "+date.y+" AND MONTH(c.cheque_fecha_alta) = "+date.m+" AND c.cheque_comentario NOT LIKE '%Dol%' AND c.cheque_comentario NOT LIKE '%DEV%' AND c.cheque_comentario NOT LIKE '%dlls%' AND c.cheque_estatus_baja = 0 AND c.cheque_ingreso = 1 AND c.cheque_cliente_id NOT IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND c.cheque_empresa_id IN (3, 15, 16, 17, 18)")

            const ganancia = (ingreso[0][0].total == null) ? 0 - total : ingreso[0][0].total - total
            const percent = Math.round((ganancia * 100) / total )

            bills.push({date: date.y+'/'+date.m, percent: percent})
        }

        return bills
    } catch (error) {
        console.log(error)
    }s
}

//? Calculate percentage per office
const getPercent = async (id) => {
    try {

        const percent = await pool.query("SELECT SUM(empleado_sueldo) * 2 AS total FROM empleados WHERE tipo_indirecto_id IN(2, 3, 14, 18) AND empleado_estatus_baja = 0 AND sucursal_id =" + id)
        const total = await pool.query("SELECT SUM(empleado_sueldo) * 2 AS total FROM empleados WHERE tipo_indirecto_id IN(2, 3, 14, 18) AND empleado_estatus_baja = 0")

        const percentage = (percent[0][0].total == null) ? 0 : Math.round((percent[0][0].total/total[0][0].total)*100)
        const percentBill = await getPercentBill(id, percent[0][0].total)

        return {percentage, percentBill, total: percent[0][0].total}
    } catch (error) {
        console.log(error)
    }
}

//? Get offices percent
const getOfficePercent = async () => {
    try {
        const offices = await pool.query("SELECT * FROM sucursal")
        let percent = []
        for (const office of offices[0]) {
            const p = await getPercent(office.sucursal_id)
            if(p.percentage != 0) percent.push({id: office.sucursal_id, nombre: office.sucursal_nombre, porcentaje: p.percentage, total: p.total, porcentajeIngreso: p.percentBill})
        }

        return percent
    } catch (error) {
        console.log(error)
    }
}

//? Get data and send to client
export const renderAnalytics = async (req, res) => {
    const dates = await getDates()
    const mme = await getMonto()
    const ventas = await getVentas(dates)
    const cotizaciones = await getCotizaciones(dates)
    const facturas = await getFacturas(dates)
    const ingresos = await getIngresos(dates)
    const metas = await getMetas(dates, mme.minimo)
    const sucursales = await getOfficePercent()

    res.render('analytics/analytics', {dates, mme, ventas, cotizaciones, facturas, ingresos, metas, sucursales})
}
//! End Analytics 


//! God end here, I'm not responsible for what you do with this code or what this code does to you
//!

//*Esto trae el header de los cards de proyectos
//Es la informacion de la cotizacion y del cliente
//Trae lo cotizado tambien
export const getProyectos = async (req, res) => {
    const cotizaciones = await pool.query("SELECT c.cotizacion_id, c.cotizacion_proyecto, c.cotizacion_moneda_id, c.total, c.pf, c.cotizacion_descripcion, cl.cliente_razon_social FROM cotizaciones c JOIN clientes cl ON c.cotizacion_cliente_id = cl.cliente_id WHERE c.cotizacion_estatus_baja = 0 AND c.cotizacion_autorizada_estatus = 1 AND liquidada_sn = 0 ")
    for (const c of cotizaciones[0]) {
        
        const cotizacionId = c.cotizacion_id

        //*costo total y cotizado
        const costoTotal = await pool.query("SELECT SUM(IF(producto_moneda_id = 1,((insumo_cantidad * producto_costo) *(1 + 1 *(.16))) * 1,((insumo_cantidad *(insumo_precio_ma + insumo_precio_mo)) *(1 + 1 *(.16))) * 21)) AS total_cotizado,SUM(IF(producto_moneda_id = 2,((insumo_cantidad * producto_costo) *(1 + 1 *(.16))) * 21,CASE insumo_precio_ma WHEN 0 THEN 0 ELSE ((insumo_cantidad * producto_costo) *(1 + 1 *(.16))) END)) AS total_costo_cotizado FROM cotizaciones_insumos JOIN productos ON producto_id = insumo_producto_id WHERE insumo_cotizacion_id = ?", [cotizacionId])
        c.costtoTotal = costoTotal[0][0].total_cotizado

        //*Obtener lo cobrado
       const cobrado = await pool.query("SELECT ROUND(SUM(CASE factura_moneda_id WHEN 1 THEN factura_total WHEN 2 THEN factura_total * 21 ELSE 0 END),2) AS facturado FROM facturas WHERE factura_proyecto_id = ? AND factura_estatus_baja = 1 ", [cotizacionId])
        c.cobrado = ((cobrado[0][0]?.cobrado == null) ? 0 : cobrado[0][0].cobrado / c.total) * 100

        //*Obtener lo facturado
        const facturado = await pool.query("SELECT SUM(CASE factura_moneda_id WHEN 1 THEN factura_total WHEN 2 THEN factura_total * 21 ELSE 0 END) AS facturado FROM facturas WHERE factura_proyecto_id = ? AND factura_estatus_baja = 1", [cotizacionId])
        c.facturas = ((facturado[0][0]?.facturado == null) ? 0 : facturado[0][0].facturado / c.total) * 100

        //*Obtener los tiempos del proyecto
        const tiemposPorcentaje = await pool.query("SELECT fecha_inicio, fecha_termino, DATEDIFF(NOW(), fecha_inicio) / DATEDIFF(fecha_termino, fecha_inicio) * 100 AS porcentaje_avance FROM cotizaciones WHERE cotizacion_id = ?", [cotizacionId])
        c.tiempos = parseInt(tiemposPorcentaje[0][0]?.porcentaje_avance || 0);

        //*Obtener lo comprado
        const acumuladoPorCotizacionId = {};

        const comprado = await pool.query("SELECT banco_cuenta_moneda_id, SUM( CASE WHEN banco_cuenta_moneda_id = 1 THEN COALESCE(pago_monto_moneda_cheque, 0) WHEN banco_cuenta_moneda_id = 2 THEN COALESCE(pago_monto_moneda_cheque, 0) * 21 ELSE 0 END ) AS pago_orden_modificado FROM cheques JOIN bancos_cuentas ON banco_cuenta_id = cheque_cuenta_id LEFT JOIN ordenes_compra_pagos ON pago_cheque_id = cheque_id LEFT JOIN ordenes_compra ON orden_id = pago_orden_id LEFT JOIN requisiciones ON requisicion_id = orden_requisicion_id WHERE cheque_ingreso <> '1' AND cheque_estatus_baja = 0 AND (COALESCE(orden_cotizacion_id, 0) = ? OR COALESCE(cheque_cotizacion_id, 0) = ? OR COALESCE(requisicion_cotizacion_id, 0) = ?) GROUP BY banco_cuenta_moneda_id, cheque_monto ORDER BY cheque_id", [cotizacionId, cotizacionId, cotizacionId]);

        for (const s of comprado[0]) {
        const cotizacionId = parseInt(c.cotizacion_id);
        const pagoOrdenModificado = parseInt(s.pago_orden_modificado);
        if (!acumuladoPorCotizacionId[cotizacionId]) {
            acumuladoPorCotizacionId[cotizacionId] = pagoOrdenModificado;
        } else {
            acumuladoPorCotizacionId[cotizacionId] += pagoOrdenModificado;
        }
        
}
        c.comprado = ((acumuladoPorCotizacionId[cotizacionId] == null) ? 0 : acumuladoPorCotizacionId[cotizacionId] / c.costtoTotal) * 100

        
    }
    return cotizaciones[0]
}


//! Start Analytics Proyectos
export const renderProyectos = async (req, res) => {
    try {
        const proyectos = await getProyectos()
        // const ids = proyectos. map((proyecto) => proyecto.cotizacion_id) // Almacenar todos los IDs en un array
        res.render('analytics/proyectos', {proyectos})
    } catch (error) {
        console.log(error)
    }

}



//?Inicia reportes de departamentos

//? get global info about all towers
const getGlobal = async () => {
    try {
        const global = await axios.post('http://rentadmin.mx/api/Info/Occupation/global', {}, {
            headers: {
                "KeyAuth": "Ah2#lb5$@"
            }
        })
        .catch(async(error) => {
            console.log(error)
        })
        return global.data.Data[0]
    } catch (error) {
        console.log(error)
    }
}

//? GET global info about towers
const getEdificios = async () => {
    try {
        const edificios = await axios.post('http://rentadmin.mx/api/Info/Occupation/building', {}, {
            headers: {
                "KeyAuth": "Ah2#lb5$@"
            }
        })
        .catch(async(error) => {
            console.log(error)
        })
        return edificios.data.Data
    } catch (error) {
        console.log(error)
    }
}

//? GET general info about towers
const getEdificiosGeneral = async () => {
    try {
        const edificios = await axios.post('http://rentadmin.mx/api/Info/Depto', {}, {
            headers: {
                "KeyAuth": "Ah2#lb5$@"
            }
        })
        .catch(async(error) => {
            console.log(error)
        })
        return edificios.data
    } catch (error) {
        console.log(error)
    }
}

const getMALCE = async () => {
    try {
        const malce = await axios.post('http://rentadmin.mx/api/Info/Malce', {}, {
            headers: {
                "KeyAuth": "Ah2#lb5$@"
            }
        })
        .catch(async(error) => {
            console.log(error)
        })
        return malce.data.Data[0]
    } catch (error) {
        console.log(error)
    }
}

export const renderEdificios = async (req, res) => {
    const global = await getGlobal()
    const infoEdificios = await getEdificios()
    const infoEdificiosGeneral = await getEdificiosGeneral()
    const malce = await getMALCE()
    console.log(malce)
    res.render('analytics/edificios', {global, infoEdificios, infoEdificiosGeneral, malce})
}
