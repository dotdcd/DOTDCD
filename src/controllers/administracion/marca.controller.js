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

export const updMarca = async (req, res) => {
    const {marca_id, marca_descripcion, marca_estatus_baja} = req.body
    const marcaid = req.params.id
    try{
        await pool.query('UPDATE marcas SET ? WHERE marca_id ='+marcaid , {marca_descripcion, marca_estatus_baja})
        return res.redirect('/dashboard/administracion/marca/buscar')	
    } catch (error) {
        return res.status(500).json({message: 'La marca '+marca_descripcion+' ya existe', status: 500})
        return res.redirect('/dashboard/administracion/marca/buscar')
    }
}

export const delMarca = async (req, res) => {
    const {marca_id} = req.params
    try{
        await pool.query('DELETE FROM marcas WHERE marca_id ='+[req.params.id])
        return res.status(200).json({message: 'Marca eliminada correctamente',status: 200})	
    } catch (error) {
        return res.status(500).json({message: 'No se puede eliminar la marca', status: 500})
    }
}



export const delPMarca = async (req, res) => {
    const {	proveedoresxmarca_marca_id} = req.params
    try{
        await pool.query('DELETE marcas_proveedores WHERE proveedoresxmarca_marca_id ='+ proveedoresxmarca_marca_id)
        return res.status(200).json({message: 'Marca eliminada correctamente',status: 200})	
    } catch (error) {
        return res.status(500).json({message: 'No se puede eliminar la marca', status: 500})
    }
}