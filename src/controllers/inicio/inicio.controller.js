import { pool } from '../../db.js'

export const updUser = async (req, res) => {
    const idu = req.params.id
    const {username, id_empleado, status} = req.body
    try {
        await pool.query('UPDATE usuarios set ? WHERE id  = ?', [req.body, req.params.id])
        return res.redirect('/dashboard/inicio/usuarios')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'El usuario ya existe', status: 500})
    }
}

export const updProducto = async (req, res) => {
    const idp = req.params.id
    const {producto_codigo, producto_descripcion, producto_tipo_id,producto_material_tipo,producto_familia_id,dispositivo_id,producto_modelo, producto_marca_id,producto_unidad_id,producto_serie_id,producto_costo,producto_costo_fecha,producto_precio_tarjeta,producto_moneda_id,producto_precio_venta} = req.body
    try {
        await pool.query('UPDATE productos set ? WHERE producto_id = ?', [req.body, req.params.id])
        return res.redirect('/dashboard/administracion/productos/buscar')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'El producto ya existe', status: 500})
    }
}

