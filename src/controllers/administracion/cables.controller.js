import { pool } from '../../db.js'

export const addCables = async (req, res) => {
    const {descripcion, clave} = req.body
    //? La fecha no se utiliza por el momento
    /*const hoy = new Date()
    const cables_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()*/
    try {
        await pool.query('INSERT INTO cable set ?', [req.body])
        req.flash('success', { title: 'Cable agregado', message: 'El cable se ha agregado correctamente' })
        return res.redirect('/dashboard/administracion/cables/nuevo')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'El cable ' + Clave + ' ya existe' })
        return res.redirect('/dashboard/administracion/cables/nuevo')
    }
}