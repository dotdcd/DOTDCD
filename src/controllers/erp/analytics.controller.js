const controller = {}
const pool = require('../../db')

//? Color schema for charts
const colors = [
    { color: '#886AB5' },
    { color: '#1DC9B7' },
    { color: '#FD3995' },
    { color: '#FFC241' },
    { color: '#2196F3' },
    { color: '#5D5D5D' },
    { color: '#886AB5' },
    { color: '#1DC9B7' },
    { color: '#FD3995' },
    { color: '#FFC241' },
    { color: '#2196F3' },
    { color: '#5D5D5D' },
    { color: '#886AB5' },
    { color: '#1DC9B7' },
    { color: '#FD3995' },
    { color: '#FFC241' },
    { color: '#2196F3' },
    { color: '#5D5D5D' },
    { color: '#886AB5' },
    { color: '#1DC9B7' },
    { color: '#FD3995' },
    { color: '#FFC241' },
    { color: '#2196F3' },
    { color: '#5D5D5D' }
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

        return employees
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

            if(employees.length > 0) empSuc.push({id: sucursal.id, sucursal: sucursal.nombre, data: employees})
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

    res.render('analytics/empleados', {employees, empType, empSuc, sucEmployees, empMob})
}

module.exports = controller;