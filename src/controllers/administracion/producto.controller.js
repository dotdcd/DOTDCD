
import {pool} from '../../db.js'

export const addProducto = async (req, res) => {
    const {producto_codigo, producto_descripcion, producto_tipo_id,producto_material_tipo,producto_familia_id,dispositivo_id,producto_modelo, producto_marca_id,producto_unidad_id,producto_serie_id,producto_costo,producto_costo_fecha,producto_precio_tarjeta,producto_moneda_id,producto_precio_venta} = req.body
    const hoy = new Date()
    const producto_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
    try { 
        await pool.query('INSERT INTO productos set ?', {producto_descripcion, producto_precio, producto_stock, producto_marca, producto_fecha_alta})
        req.flash('success', {title: 'Producto agregado', message: 'El producto se ha agregado correctamente'})
        return res.redirect('/dashboard/administracion/producto/nuevo')
    } catch (error) {
        req.flash('error', {title: 'Ooops!', message: 'El producto '+producto_descripcion+' ya existe'})
        return res.redirect('/dashboard/administracion/producto/nuevo')
    }   
}

export const delProducto = async (req, res) => {
    const {id} = req.params
    try {
        await pool.query('DELETE FROM productos WHERE producto_id = ?', [id])
        req.flash('success', {title: 'Producto eliminado', message: 'El producto se ha eliminado correctamente'})
        return res.redirect('/dashboard/administracion/producto')
    } catch (error) {
        req.flash('error', {title: 'Ooops!', message: 'No se pudo eliminar el producto'})
        return res.redirect('/dashboard/administracion/producto')
    }
}

export const updProducto = async (req, res) => {
    const {id} = req.params
    const {producto_descripcion, producto_precio, producto_stock, producto_marca} = req.body
    try {
        await pool.query('UPDATE productos set ? WHERE producto_id = ?', [{producto_descripcion, producto_precio, producto_stock, producto_marca}, id])
        req.flash('success', {title: 'Producto actualizado', message: 'El producto se ha actualizado correctamente'})
        return res.redirect('/dashboard/administracion/producto')
    } catch (error) {
        req.flash('error', {title: 'Ooops!', message: 'No se pudo actualizar el producto'})
        return res.redirect('/dashboard/administracion/producto')
    }
}
