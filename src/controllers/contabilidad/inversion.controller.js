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