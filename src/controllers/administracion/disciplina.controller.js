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
    const { familia_clave, familia_descripcion, familia_estatus_baja } = req.body
    try {
        await pool.query('UPDATE familias set ? WHERE familia_id = '+req.params.id, { familia_clave, familia_descripcion, familia_estatus_baja })
        req.flash('success', { title: 'Familia / Disciplina actualizada', message: 'La Disciplina se ha actualizado correctamente' })
        return res.redirect('/dashboard/administracion/disciplina/buscar')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'La familia / disciplina ' + familia_descripcion + ' ya existe' })
        return res.redirect('/dashboard/administracion/disciplina/buscar')
    }
}


//! fin de actualizar familia / disciplina







//* Eliminar familia / disciplina

export const delDisciplina = async (req, res) => {
    try {
        
        await pool.query('DELETE FROM familias WHERE familia_id = ?', [req.params.id])
        return res.status(200).json({ message: 'La familia / disciplina se ha eliminado correctamente' })
    } catch (error) {
        return res.status(500).json({ message: 'La familia / disciplina no se ha podido eliminar' })
    }
}

//! fin de eliminar familia / disciplina