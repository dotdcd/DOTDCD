import { pool } from '../../db.js'


export const addDispositivo = async (req, res) => {
    try{
        await pool.query('INSERT INTO dispositivo set ?', [req.body])
        req.flash('success', {title: 'Dispositivo agregado', message: 'El dispositivo se ha agregado correctamente'})
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    }
    catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El dispositivo ya existe'})
        return res.redirect('/dashboard/administracion/dispositivos/nuevo')
    }

}


export const updDispositivo = async (req, res) => {
    try{

        await pool.query('UPDATE dispositivo set ? WHERE dispositivo_id = ?', [req.body, req.params.id])
        req.flash('success', {title: 'Dispositivo actualizado', message: 'El dispositivo se ha actualizado correctamente'})
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El dispositivo no se pudo modificar'})
        return res.redirect('/dashboard/administracion/dispositivos/editar/' + req.params.id)
    }
}

export const delDispositivo = async (req, res) => {
    try{
        await pool.query('UPDATE dispositivo set dispositivo_estatus_baja = 1 WHERE dispositivo_id = ?', [req.params.id])
        req.flash('success', {title: 'Dispositivo eliminado', message: 'El dispositivo se ha eliminado correctamente'})
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El dispositivo no se pudo eliminar'})
        return res.redirect('/dashboard/administracion/dispositivos/buscar')
    }
}