const controller = {}
const pool = require('../../db')

//* RENDER Employees

//? Color schema for charts
const colors = [
    { color: '#6A7EB5' },
    { color: '#1DC7A0' },
    { color: '#FFD541' },
    { color: '#CCBFDF' },
    { color: '#5D5D5D' },
    { color: '#FD3995' },
    { color: '#886AB5' },
    { color: '#003997' },
    { color: '#6A7EB5' },
    { color: '#1DC7A0' },
    { color: '#FFD541' },
    { color: '#CCBFDF' },
    { color: '#5D5D5D' },
    { color: '#FD3995' },
    { color: '#886AB5' },
    { color: '#003997' },
    { color: '#6A7EB5' },
    { color: '#1DC7A0' },
    { color: '#FFD541' },
    { color: '#CCBFDF' },
    { color: '#5D5D5D' },
    { color: '#FD3995' },
    { color: '#886AB5' },
    { color: '#003997' }
]

//? Get Total num of employees function
const getTotal = async () => {
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

controller.renderEmployees = async (req, res) => {

    const employees = await getEmpleados()
    const empType = await getEmpType()
    const empSuc = await getEmpSuc()
    const sucEmployees = await getEmpForSuc()
    const empMob = await getEmpMob()

    const orderSuc = sucEmployees.sort(function (a, b){
        if(a.total > b.total){
            return 1
        }
        if(a.total < b.total){
            return -1
        }

        return 0
    })

    console.log(orderSuc.reverse())
    
    res.render('analytics/empleados', {employees, empType, empSuc, orderSuc, empMob})
}
//! End Employees


//* Render Analytics
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

const getVentas = async () => {
    try {
        const ventas = await pool.query("SELECT y, m, ventas, ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT y,m,count(*) as ventas, (SELECT ROUND(SUM((total/1.16)), 2) FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND MONTH(cotizacion_fecha_autorizada) = m AND YEAR(cotizacion_fecha_autorizada) = y ) AS pesos, (SELECT ROUND(SUM((total/1.16)), 2)*21 FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND MONTH(cotizacion_fecha_autorizada) = m AND YEAR(cotizacion_fecha_autorizada) = y ) AS usd FROM (SELECT YEAR(cotizacion_fecha_autorizada) as y, MONTH(cotizacion_fecha_autorizada) as m FROM cotizaciones WHERE cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0) as t GROUP BY y,m order by y desc,m desc LIMIT 13) as tt GROUP BY y,m order by y desc,m desc")

        return ventas[0]
    } catch (error) {
        console.log(error)
    }
}

const getCotizaciones = async () => {
    try {
        const cotizaciones = await pool.query("SELECT y, m, ventas, ROUND(SUM(pesos+usd)) AS total FROM (SELECT y,m,count(*) as ventas, (SELECT ROUND(SUM((total/1.16)), 2) FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND pf > 0 AND MONTH(cotizacion_fecha_alta) = m AND YEAR(cotizacion_fecha_alta) = y ) AS pesos, (SELECT ROUND(SUM((total/1.16)), 2)*21 FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND pf > 0 AND MONTH(cotizacion_fecha_alta) = m AND YEAR(cotizacion_fecha_alta) = y ) AS usd FROM (SELECT YEAR(cotizacion_fecha_alta) as y, MONTH(cotizacion_fecha_alta) as m FROM cotizaciones WHERE  pf > 0) as t GROUP BY y,m order by y desc,m desc LIMIT 13) as tt GROUP BY y,m order by y desc,m desc")
        
        return cotizaciones[0]
    } catch (error) {
        console.log(error)
    }
}

const getFacturas = async () => {
    try {
        const facturas = await pool.query("SELECT y, m, facturas, ROUND(SUM(A+(B*21))) AS total FROM (SELECT y,m,count(*) as facturas, (SELECT IFNULL(ROUND(SUM(factura_subtotal), 2), 0) AS pesos FROM facturas WHERE facturas.factura_moneda_id = 1 AND MONTH(factura_fecha_alta) = m AND YEAR(factura_fecha_alta) = y AND factura_estatus_baja = 1 AND NOT factura_cliente_id IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND factura_empresa_id IN (3, 15, 16, 17, 18)) A, (SELECT IFNULL(ROUND(SUM(factura_subtotal), 2), 0) AS usd FROM facturas WHERE facturas.factura_moneda_id = 2 AND MONTH(factura_fecha_alta) = m AND YEAR(factura_fecha_alta) = y AND factura_estatus_baja = 1 AND NOT factura_cliente_id IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND factura_empresa_id IN (3, 15, 16, 17, 18) ) B FROM  (SELECT YEAR(factura_fecha_alta) as y, MONTH(factura_fecha_alta) as m FROM facturas WHERE factura_estatus_baja = 1 AND NOT factura_cliente_id IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND factura_empresa_id IN (3, 15, 16, 17, 18)) as t GROUP BY y,m order by y desc,m desc LIMIT 13) as tt GROUP BY y,m order by y desc,m desc LIMIT 13")

        return facturas[0]
    } catch (error) {
        console.log(error)
    }
}

const getIngresos = async () => {
    try {
        const ingresos = await pool.query("SELECT y,m,count(*) as cheques, (SELECT ROUND(SUM(cheque_subtotal), 2) FROM cheques WHERE cheque_comentario NOT LIKE '%Dol%' AND cheque_comentario NOT LIKE '%DEV%' AND cheque_estatus_baja = 0 AND cheque_ingreso = 1 AND cheque_cliente_id NOT IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND cheque_empresa_id IN (3, 15, 16, 17, 18) AND YEAR(cheque_fecha_alta) = y AND MONTH(cheque_fecha_alta) = m) AS total FROM (SELECT YEAR(cheque_fecha_alta) as y, MONTH(cheque_fecha_alta) as m FROM cheques WHERE cheque_comentario NOT LIKE '%Dol%' AND cheque_comentario NOT LIKE '%DEV%' AND cheque_estatus_baja = 0 AND cheque_ingreso = 1 AND cheque_cliente_id NOT IN(111, 290, 107, 1049, 2584, 3149, 3152, 3154, 3175, 3314, 2369, 3242, 3243) AND cheque_empresa_id IN (3, 15, 16, 17, 18)) as t GROUP BY y,m order by y desc,m desc LIMIT 13")

        return ingresos[0]
    } catch (error) {
        console.log(error)
    }
}

const calMetas = async (date, minimo) => {
    try {
        const y = date.y - 1
        const mc = await pool.query("SELECT ROUND(total/totalv, 2) as mc FROM (SELECT ROUND(SUM(pesos+usd), 2) AS total FROM (SELECT ROUND(SUM((total/1.16) * (pf/100)), 2) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS pesos, (SELECT ROUND(SUM((total/1.16) * (pf/100)), 2)*21 as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS usd) as t, (SELECT ROUND(SUM(pesos+usd), 2) AS totalv FROM (SELECT ROUND(SUM((total/1.16)), 2) as pesos FROM cotizaciones WHERE cotizacion_moneda_id = 1 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS pesos, (SELECT ROUND(SUM((total/1.16)), 2)*21 as usd FROM cotizaciones WHERE cotizacion_moneda_id = 2 AND pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31' ) AS usd) as tt")

        const pb = await pool.query("SELECT ROUND(ventas / cotizaciones, 2) as pb FROM (SELECT ROUND(SUM(total), 2) AS cotizaciones FROM cotizaciones WHERE pf > 0 AND cotizacion_fecha_alta BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31')B, (SELECT ROUND(SUM(total), 2) AS ventas FROM cotizaciones WHERE cotizacion_autorizada_estatus IN (1, 2, 3) AND pf > 0 AND cotizacion_fecha_autorizada BETWEEN '"+y+"-"+date.m+"-01' AND '"+date.y+"-"+date.m+"-31')A")

        const metas = {
            mc: {
                minimo: Math.round(minimo/mc[0][0].mc),
                media: Math.round((minimo/mc[0][0].mc) * 1.5),
                esperado: Math.round((minimo/mc[0][0].mc) * 2)
            },
            pb: {
                minimo: Math.round(minimo/pb[0][0].pb),
                media: Math.round((minimo/pb[0][0].pb) * 1.5),
                esperado: Math.round((minimo/pb[0][0].pb) * 2)
            }
        }

        return metas

    } catch (error) {
        console.log(error)
    }
}


const getMetas = async (cotizaciones, minimo) => {
    try {
        let metas = []
        for (const c of cotizaciones) {
            const mts = await calMetas(c, minimo)
            metas.push(mts)   
        }

        return metas
    } catch (error) {
        console.log(error)
    }
}

controller.renderAnalytics = async (req, res) => {
    const mme = await getMonto()
    const ventas = await getVentas()
    const cotizaciones = await getCotizaciones()
    const facturas = await getFacturas()
    const ingresos = await getIngresos()
    const metas = await getMetas(cotizaciones, mme.minimo)

    res.render('analytics/analytics', {mme, ventas, cotizaciones, facturas, ingresos, metas})
}
//! End Analytics

controller.renderProyectos = async (req, res) => {
res.render('analytics/proyectos')

} 
module.exports = controller;/////