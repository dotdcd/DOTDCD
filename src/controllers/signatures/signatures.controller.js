import {pool} from '../../db.js'

export const addSignatureT = async (req, res) => {
    try {
        const { firma, nombre, lvl } = req.body;

        await pool.query("INSERT INTO firmas SET ?", {firma, nombre, lvl})

        return res.status(200).json({ message: 'Contrato firmado', status: 200 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'No se encontro contrato', status: 500 })
    }
}

export const updSignatureT = async (req, res) => {
    try {
        const { id, firma, nombre, lvl } = req.body;

        await pool.query("UPDATE firmas SET firma = ?, nombre = ?, lvl = ? WHERE id = ?", [firma, nombre, lvl, id])

        return res.status(200).json({ message: 'Contrato firmado', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'No se encontro contrato', status: 500 })
    }
}

export const dltSignatureT = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM firmas WHERE id = ?", [id])

        return res.status(200).json({ message: 'Contrato firmado', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'No se encontro contrato', status: 500 })
    }
}