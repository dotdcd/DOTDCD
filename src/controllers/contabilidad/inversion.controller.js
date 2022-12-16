import { pool } from '../../db.js'


export const addInversion = async (req, res) => {

    const { inversion_clave, Inversion_descripcion } = req.body
    const hoy = new Date()
    const cliente_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()

    try {
        await pool.query('INSERT INTO inversiones set ?', [req.body])
        req.flash('success', { title: 'Inversion agregada', message: 'La inversion se ha agregado correctamente' })
        return res.redirect('/dashboard/contabilidad/inversiones/nuevo')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'La inversion ' + inversion_clave + ' ya existe' })
        return res.redirect('/dashboard/contabilidad/inversiones/nuevo')
    }
}


export const updInversion = async (req, res) => {
    const { Inversion_descripcion, inversion_clave } = req.body
    const inversion_id = req.params.id
    try {
        await pool.query('UPDATE inversiones set ? WHERE inversion_id = '+inversion_id, [req.body])
        req.flash('success', { title: 'Inversion actualizada', message: 'La inversion se ha actualizado correctamente' })
        return res.redirect('/dashboard/contabilidad/inversiones/buscar')
    }
    catch (error) {
        console.log(error)
        req.flash('error', { title: 'Ooops!', message: 'La inversion no se ha podido actualizar' })
        return res.redirect('/dashboard/contabilidad/inversiones/buscar')
    }
}


export const deleteInversion = async (req, res) => {
    const {id} = req.params.id
    try {
        await pool.query('DELETE FROM inversiones WHERE inversion_id = ?', [req.params.id])
        return res.status(200).json({ message: 'La empresa se ha eliminado correctamente', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'El proveedor no se puede eliminar', status: 500 })
    }   
}




