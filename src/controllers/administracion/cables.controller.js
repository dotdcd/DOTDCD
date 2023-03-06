import { pool } from '../../db.js'


//? Agrega cables a la base de datos
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
//!Fin de agregar cables


//?Actualiza los datos de la base de datos
export const updCables = async (req, res) => {
    const {descripcion, clave, cable_estatus_baja} = req.body
    try {
        await pool.query('UPDATE cable SET ? WHERE cable_id ='+req.params.id , {descripcion, clave, cable_estatus_baja})
        return res.redirect('/dashboard/administracion/cables/buscar')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'El cable ' + Clave + ' ya existe' })
        return res.redirect('/dashboard/administracion/cables/buscar')
    }
}
//! fin de actualizar cables

//? Elimina los cables de la base de datos
export const delCables = async (req, res) => {
    try{
        await pool.query('DELETE FROM cable WHERE cable_id ='+[req.params.id])
        return res.status(200).json({ message: 'El cable se ha eliminado correctamente', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'Ooops! Algo salió mal', status: 500 })
    }
}
//! fin de eliminar cables