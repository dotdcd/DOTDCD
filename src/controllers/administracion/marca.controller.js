import {pool} from '../../db.js'

export const addMarca = async (req, res) => {
    const {marca_descripcion} = req.body
    const hoy = new Date()
    const marca_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
    try { 
        await pool.query('INSERT INTO marcas set ?', {marca_descripcion, marca_fecha_alta})
        req.flash('success', {title: 'Marca agregada', message: 'La marca se ha agregado correctamente'})
        return res.redirect('/dashboard/administracion/marca/nuevo')
    } catch (error) {
        req.flash('error', {title: 'Ooops!', message: 'La marca '+marca_descripcion+' ya existe'})
        return res.redirect('/dashboard/administracion/marca/nuevo')
    }   
}