import { pool } from '../../db.js'


//* Agregar nueva familia / disciplina
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
//! fin de agregar nueva familia / disciplina





//* Actualizar familia / disciplina
export const updDisciplina = async (req, res) => {
    try {
        const { familia_clave, familia_descripcion } = req.body
        await pool.query('UPDATE familias set ? WHERE familia_clave = ?', [req.body, familia_clave])
        req.flash('success', { title: 'Familia / Disciplina actualizada', message: 'La Disciplina se ha actualizado correctamente' })
        return res.redirect('/dashboard/administracion/disciplina')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'La familia / disciplina ' + familia_descripcion + ' ya existe' })
        return res.redirect('/dashboard/administracion/disciplina')
    }
}


//! fin de actualizar familia / disciplina







//* Eliminar familia / disciplina

export const delDisciplina = async (req, res) => {
    try {
        const { familia_clave } = req.params
        await pool.query('DELETE FROM familias WHERE familia_clave = ?', [familia_clave])
        req.flash('success', { title: 'Familia / Disciplina eliminada', message: 'La Disciplina se ha eliminado correctamente' })
        return res.redirect('/dashboard/administracion/disciplina')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'La familia / disciplina no se ha podido eliminar' })
        return res.redirect('/dashboard/administracion/disciplina')
    }
}

//! fin de eliminar familia / disciplina