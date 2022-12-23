
import {pool} from '../../db.js'

export const addProducto = async (req, res) => {
    const {producto_codigo, producto_descripcion, producto_tipo_id,producto_material_tipo,producto_familia_id,dispositivo_id,producto_modelo, producto_marca_id,producto_unidad_id,producto_serie_id,producto_costo,producto_costo_fecha,producto_precio_tarjeta,producto_moneda_id,producto_precio_venta} = req.body
    const hoy = new Date()
    const producto_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
    try { 
        console.log(req.body)
        await pool.query('INSERT INTO productos set ?', [req.body])
        req.flash('success', {title: 'Producto agregado', message: 'El producto o servicio se ha agregado correctamente'})
        return res.redirect('/dashboard/administracion/productos/buscar')
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'Ooops!', message: 'El producto '+producto_descripcion+' ya existe'})
        return res.redirect('/dashboard/administracion/productos/buscar')
    }   
}

export const delProducto = async (req, res) => {
    const {id} = req.params
    try {
        await pool.query('DELETE FROM productos WHERE producto_id = ?', [req.params.id])
        return res.status(200).json({message: 'Producto eliminado correctamente',status: 200})	
    } catch (error) {
        return res.status(500).json({message: 'No se puede eliminar el producto', status: 500})
    }
}

export const updProducto = async (req, res) => {
    const idp = req.params.id
    const {producto_codigo, producto_descripcion, producto_tipo_id,producto_material_tipo,producto_familia_id,dispositivo_id,producto_modelo, producto_marca_id,producto_unidad_id,producto_serie_id,producto_costo,producto_costo_fecha,producto_precio_tarjeta,producto_moneda_id,producto_precio_venta} = req.body
    try {
        await pool.query('UPDATE productos set ? WHERE producto_id = ?', [req.body, req.params.id])
        console.log(req.body)
        return res.redirect('/dashboard/administracion/productos/buscar')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'El producto ya existe', status: 500})
    }
}
