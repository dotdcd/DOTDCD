import { pool } from '../../db.js'

export const addDisciplina = async (req, res) => {
    try {
        const { familia_clave, familia_descripcion } = req.body
        const hoy = new Date()
        const familia_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
        await pool.query('INSERT INTO familias set ?', [req.body])
        req.flash('success', { title: 'Familia / Disciplina agregada', message: 'La Disciplina se ha agregado correctamente' })
        return res.redirect('/dashboard/administracion/disciplina/nuevo')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'La familia / disciplina ' + familia_descripcion + ' ya existe' })
        return res.redirect('/dashboard/administracion/disciplina/nuevo')
    }
}
