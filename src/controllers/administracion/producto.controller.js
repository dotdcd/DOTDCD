
import {pool} from '../../db.js'

export const addProducto = async (req, res) => {
    const {producto_descripcion} = req.body
    try { 
        
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
    const id = req.params.id
    try {
      await pool.query('UPDATE productos SET producto_estatus_baja = 1 WHERE producto_id = '+id)
      req.flash('success', {title: 'Producto eliminado', message: 'El producto o servicio se ha eliminado correctamente'})
      res.redirect('/dashboard/administracion/productos/buscar')
    } catch (error) {
        console.log(error)
      res.redirect('/dashboard/administracion/productos/buscar')
    }
  }; 

export const updProducto = async (req, res) => {
    try {
        await pool.query('UPDATE productos set ? WHERE producto_id = ?', [req.body, req.params.id])
        return res.redirect('/dashboard/administracion/productos/buscar')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'El producto ya existe', status: 500})
    }
}
