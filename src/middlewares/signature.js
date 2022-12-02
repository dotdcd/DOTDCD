import * as jose from 'jose'
import jwt from 'jsonwebtoken'
import {pool} from '../db.js'
import { SECRET } from '../config.js'

export const authenticateSignature = async (req, res, next) => {
    try {
        const token = req.cookies
        const decoded = jwt.verify(token.sessionToken, SECRET)
        const info = await pool.query("SELECT * FROM usuarios WHERE id = '" + decoded.id + "'")
        const {id} = req.params
        console.log(id)

        if(!token.sessionToken) {
            req.flash('error', {title: 'Ooops!', message: 'Necesitas iniciar sesión para poder acceder al erp, inicia sesión.'})
            res.redirect('/')
        }

        if(info[0][0].id_empleado != id) {
            req.flash('error', {title: 'Ooops!', message: 'No tienes permisos para acceder a esta página.'})
            res.redirect('/logout')
        }

        await jose.jwtVerify(
            token.sessionToken,
            new TextEncoder().encode(SECRET)
        )

        next()

    } catch (error) {
        console.log(error)
    }
}
