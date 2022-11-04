import { pool } from '../../db.js';

//* Render Analytics
const getMonto = async (id) => {
    try {
        const mme = {}
        const nCampo = await pool.query("SELECT SUM(empleado_sueldo) AS sum FROM empleados WHERE tipo_indirecto_id IN(2, 3, 14, 18) AND empleado_estatus_baja = 0 AND sucursal_id =" + id)
        if (nCampo[0][0].sum == null) return 0
        mme.minimo = Math.round((nCampo[0][0].sum * 3) * 2)
        mme.media = Math.round(mme.minimo * 1.5)
        mme.esperado = Math.round(mme.minimo * 2)

        return mme
    } catch (error) {
        return (error)
    }
}

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

const getVentas = async (id, dates) => {
    try {

        let ventas = []
        for (const date of dates) {
            const venta = await pool.query("SELECT ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT ROUND(SUM((total/1.16)), 2) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND sucursal_id = " + id + " AND MONTH(cotizacion_fecha_autorizada) = "+date.m+" AND YEAR(cotizacion_fecha_autorizada) = "+date.y+" ) AS pesos, (SELECT IFNULL((SUM((IFNULL(total, 0)/1.16))*21), 0) as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND sucursal_id = " + id + " AND MONTH(cotizacion_fecha_autorizada) = "+date.m+" AND YEAR(cotizacion_fecha_autorizada) = "+date.y+" ) AS usd ")
            if(venta[0][0].total == null) ventas.push({total: 0})
            else ventas.push({total: venta[0][0].total})
        }

        return ventas
    } catch (error) {
        console.log(error)
    }
}

const getCotizaciones = async (id, dates) => {
    try {
        let cotizaciones = []
        for (const date of dates) {
            const cotizacion = await pool.query("SELECT ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT IFNULL((SUM((IFNULL(total, 0)/1.16))), 0) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND pf > 0 AND sucursal_id = " + id + " AND MONTH(cotizacion_fecha_alta) = "+date.m+" AND YEAR(cotizacion_fecha_alta) = "+date.y+" ) AS pesos, (SELECT IFNULL((SUM((IFNULL(total, 0)/1.16))*21), 0) as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND pf > 0 AND sucursal_id = " + id + " AND MONTH(cotizacion_fecha_alta) = "+date.m+" AND YEAR(cotizacion_fecha_alta) = "+date.y+" ) AS usd")
            if(cotizacion[0][0].total == null) cotizaciones.push({total: 0})
            else cotizaciones.push({total: cotizacion[0][0].total})
        }

        return cotizaciones
    } catch (error) {
        console.log(error)
    }
}

const getFacturas = async (id, dates) => {
    try {
        let facturas = []
        for (const date of dates) {
            const factura = await pool.query("SELECT ROUND(SUM(pesos+(usd*21))) AS total FROM (SELECT ROUND(SUM(IFNULL(factura_subtotal, 0)), 2) AS pesos FROM facturas WHERE facturas.factura_moneda_id = 1 AND MONTH(factura_fecha_alta) = "+date.m+" AND YEAR(factura_fecha_alta) = "+date.y+" AND factura_estatus_baja = 1 AND NOT factura_cliente_id IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND factura_empresa_id IN (3, 15, 16, 17, 18) AND sucursal_id = " + id + ") a, (SELECT ROUND(SUM(IFNULL(factura_subtotal, 0)), 2) AS usd FROM facturas WHERE facturas.factura_moneda_id = 2 AND MONTH(factura_fecha_alta) = "+date.m+" AND YEAR(factura_fecha_alta) = "+date.y+" AND factura_estatus_baja = 1 AND NOT factura_cliente_id IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND factura_empresa_id IN (3, 15, 16, 17, 18) AND sucursal_id = " + id + ") b")
            if(factura[0][0].total == null) facturas.push({total: 0})
            else facturas.push({total: factura[0][0].total})
        }

        return facturas
    } catch (error) {
        console.log(error)
    }
}

const getIngresos = async (id, dates) => {
    try {

        let ingresos = []
        for (const date of dates) {
            const ingreso = await pool.query("SELECT ROUND(SUM(fp.pago_monto_moneda_cheque), 2) as total FROM facturas_pagos fp INNER JOIN facturas f ON f.factura_id = fp.pago_factura_id INNER JOIN cheques c ON c.cheque_id = fp.pago_cheque_id WHERE f.sucursal_id = "+id+" AND YEAR(c.cheque_fecha_alta) = "+date.y+" AND MONTH(c.cheque_fecha_alta) = "+date.m+" AND c.cheque_comentario NOT LIKE '%Dol%' AND c.cheque_comentario NOT LIKE '%DEV%' AND c.cheque_comentario NOT LIKE '%dlls%' AND c.cheque_estatus_baja = 0 AND c.cheque_ingreso = 1 AND c.cheque_cliente_id NOT IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND c.cheque_empresa_id IN (3, 15, 16, 17, 18)")
            if(ingreso[0][0].total == null) ingresos.push({total: 0})
            else ingresos.push({total: ingreso[0][0].total})
        }

        return ingresos
    } catch (error) {
        console.log(error)
    }
}

const calMetas = async (date, minimo, id) => {
    try {
        const y = date.y - 1
        const mc = await pool.query("SELECT ROUND(total/totalv, 2) as mc FROM (SELECT ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT ROUND(SUM((total/1.16) * (pf/100)), 2) as pesos FROM cotizaciones WHERE sucursal_id = " + id + " AND cotizacion_moneda_id = 1 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '" + y + "-" + date.m + "-01' AND '" + date.y + "-" + date.m + "-31' ) AS pesos, (SELECT IFNULL((SUM((IFNULL(total, 0)/1.16) * (pf/100))*21), 0) as usd FROM cotizaciones WHERE sucursal_id = " + id + " AND cotizacion_moneda_id = 2 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '" + y + "-" + date.m + "-01' AND '" + date.y + "-" + date.m + "-31' ) AS usd) as t, (SELECT ROUND(SUM(pesos+usd), 2) AS totalv FROM (SELECT ROUND(SUM((total/1.16)), 2) as pesos FROM cotizaciones WHERE sucursal_id = " + id + " AND cotizacion_moneda_id = 1 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '" + y + "-" + date.m + "-01' AND '" + date.y + "-" + date.m + "-31' ) AS pesos, (SELECT IFNULL(ROUND(SUM((total/1.16)), 2)*21, 0) as usd FROM cotizaciones WHERE sucursal_id = " + id + " AND cotizacion_moneda_id = 2 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '" + y + "-" + date.m + "-01' AND '" + date.y + "-" + date.m + "-31' ) AS usd) as tt")

        const pb = await pool.query("SELECT ROUND(ventas / cotizaciones, 2) as pb FROM (SELECT ROUND(SUM(total), 2) AS cotizaciones FROM cotizaciones WHERE sucursal_id = " + id + " AND pf > 0 AND cotizacion_fecha_alta BETWEEN '" + y + "-" + date.m + "-01' AND '" + date.y + "-" + date.m + "-31')B, (SELECT ROUND(SUM(total), 2) AS ventas FROM cotizaciones WHERE sucursal_id = " + id + " AND cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND cotizacion_fecha_autorizada BETWEEN '" + y + "-" + date.m + "-01' AND '" + date.y + "-" + date.m + "-31')A")

        const mcr = (mc[0][0].mc == null) ? 1 : mc[0][0].mc
        const pbr = (pb[0][0].pb == null) ? 1 : pb[0][0].pb

        const metas = {
            mc: {
                minimo: Math.round(minimo / mcr),
                media: Math.round((minimo / mcr) * 1.5),
                esperado: Math.round((minimo / mcr) * 2)
            },
            pb: {
                minimo: Math.round(minimo / pbr),
                media: Math.round((minimo / pbr) * 1.5),
                esperado: Math.round((minimo / pbr) * 2)
            }
        }

        return metas

    } catch (error) {
        console.log(error)
    }
}


const getMetas = async (dates, minimo, id) => {
    try {
        let metas = []
        for (const date of dates) {
            const mts = await calMetas(date, minimo, id)
            metas.push(mts)
        }

        return metas
    } catch (error) {
        console.log(error)
    }
}

export const renderOffice = async (req, res) => {
    try {
        const id = req.params.id
        const sucursal = await pool.query("SELECT sucursal_nombre FROM sucursal WHERE sucursal_id = " + id)
        const mme = await getMonto(id)
        if (mme == 0) return res.redirect('/dashboard/analytics/analytics')

        const dates = await getDates()
        const ventas = await getVentas(id, dates)
        const cotizaciones = await getCotizaciones(id, dates)
        const facturas = await getFacturas(id, dates)
        const ingresos = await getIngresos(id, dates)
        const metas = await getMetas(dates, mme.minimo, id)

        return res.render('analytics/sucursal', { sucursal, dates, mme, ventas, cotizaciones, facturas, ingresos, metas })
    } catch (error) {
        console.log(error)
    }
}