import { sendEmail } from "../../helpers/mailer.js";
import { pool } from "../../db.js";

export const addContract = async (req, res) => {
    try {
        const { id, empresa, periodo, sueldo, inicio, vencimiento } = req.body;

        await pool.query("INSERT INTO CONTRATOS SET ? ON DUPLICATE KEY UPDATE empresa = ?, periodo = ?, sueldo = ?, fecha_inicio = ?, fecha_fin = ?, empleado_id = ?", [{empresa, periodo, sueldo, fecha_inicio: inicio, fecha_fin: vencimiento, empleado_id: id}, empresa, periodo, sueldo, inicio, vencimiento, id])
        await pool.query("UPDATE usuarios SET status = 0 WHERE id_empleado = ?", [id])
        const info = await pool.query("SELECT CONCAT(empleado_nombre, ' ', empleado_paterno, ' ', empleado_materno) as employee, empleado_email FROM empleados WHERE empleado_id = ?", [id])
        const data = {
            id: id,
            subject: "Firma de contrato ✔",
            email: info[0][0].empleado_email,
            mail: `
            <h1>Buen día ${info[0][0].employee} </h1>
            <h2>Tu renovación de contrato a comenzado.</h2>
            <p>Para continuar con el proceso de renovación entra al siguiente enlace en las ultimas 24 horas y firma tu contrato</p>
            <a href="https://dotdcd.com.mx">Firmar contrato</a>
        `
        }
        await sendEmail(data);



        return res.status(200).json('Contrato registrado')
    } catch (error) {
        console.log(error)
    }
}

export const addSignature = async (req, res) => {
    try {
        const { id, firma } = req.body;
        const hoy = new Date();
        const fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

        await pool.query("UPDATE CONTRATOS SET firma = ?, fecha_firma = ?, status = 1 WHERE id = ?", [firma, fecha, id])

        return res.status(200).json({ message: 'Contrato firmado', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'No se encontro contrato', status: 500 })
    }
}

const addpastContract = async (id) => {
    try {
        const contrato = await pool.query("SELECT * FROM CONTRATOS WHERE empleado_id = ? AND status = 2", [id])
        if(contrato[0].length > 0){
            await pool.query("INSERT INTO contratosTotales SET ?", contrato[0][0])
            await pool.query("DELETE FROM CONTRATOS WHERE id = ? AND status = 2", [contrato[0][0].id])
        }
    } catch (error) {
        console.log(error)
    }
}

export const aceptContract = async (req, res) => {
    try{
        const { id, status } = req.body;
        const hoy = new Date();
        const fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();

        const conditon = await pool.query("SELECT * FROM CONTRATOS WHERE id = ?", [id])
        if(![conditon][0].length > 0) return res.status(500).json({ message: 'No se encontro contrato', status: 500 })

        await addpastContract(conditon[0][0].empleado_id)

        await pool.query("UPDATE CONTRATOS SET status = ?, reconocimiento = ? WHERE id = ?", [status, fecha, id])
        await pool.query("UPDATE usuarios SET status = 1 WHERE id_empleado = ?", [conditon[0][0].empleado_id])
        let sueldo = conditon[0][0].sueldo / 2
        await pool.query("UPDATE empleados SET empleado_sueldo = ?, empleado_empresa_id = ? WHERE empleado_id = ?", [sueldo, conditon[0][0].empresa, conditon[0][0].empleado_id])

        return res.status(200).json({ message: 'Contrato modificado', status: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'No se encontro contrato', status: 500 })
    }
}

export const declibeContract = async (req, res) => {
    try{
        const { id, status } = req.body;


        await pool.query("UPDATE CONTRATOS SET status = ? WHERE id = ?", [status, id])

        return res.status(200).json({ message: 'Contrato modificado', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'No se encontro contrato', status: 500 })
    }
}

export const ferifyC = async (req, res) => {
    try {
        const docs = await pool.query("SELECT * FROM USERS_FILES WHERE userId = ?", [req.params.id])
        if(docs[0].length > 0){
            console.log('si hay documentos')
        } else {
            return res.status(200).json({ message: 'No hay documentos', status: 200 })
        }
    } catch (error) {
        console.log(error)
    }
}