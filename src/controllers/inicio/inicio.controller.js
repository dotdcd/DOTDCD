import { pool } from '../../db.js'

export const updUser = async (req, res) => {
    try {
        await pool.query('UPDATE usuarios set ? WHERE id  = ?', [req.body, req.params.id])
        return res.redirect('/dashboard/inicio/usuarios')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'El usuario ya existe', status: 500})
    }
}

export const updProducto = async (req, res) => {
    try {
        await pool.query('UPDATE productos set ? WHERE producto_id = ?', [req.body, req.params.id])
        return res.redirect('/dashboard/administracion/productos/buscar')
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'El producto ya existe', status: 500})
    }
}

