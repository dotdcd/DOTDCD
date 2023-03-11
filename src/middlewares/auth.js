import * as jose from 'jose'
import jwt from 'jsonwebtoken'
import {pool} from '../db.js'
import { SECRET } from '../config.js'

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies
        if(!token.sessionToken) {
            req.flash('error', {title: 'Ooops!', message: 'Necesitas iniciar sesión para poder acceder al erp, inicia sesión.'})
            res.redirect('/')
        }

        const decoded = jwt.verify(token.sessionToken, SECRET)
        const status = await pool.query("SELECT * FROM usuarios WHERE id = '" + decoded.id + "'")
        req.body.info = status[0][0]

        if(status[0][0].status == 0) {
            req.flash('infoSign', {title: 'Ooops!', message: 'Tu cuenta aun no ha sido activada, firma tu contrato y en breve un administrador activara tu cuenta.'})
            res.redirect('/signature/'+status[0][0].id_empleado)
        }
        if(status[0][0].status == 2) {
            req.flash('error', {title: 'Ooops!', message: 'Tu cuenta ha sido suspendida, contacta con el administrador para más información.'})
            res.redirect('/')
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


export const isAdmin = async (req, res, next) => {
    try {
        const {info} = req.body
        if(!info.roles == 1) {
            return res.status(404).render('errors/error', { layout: 'auth', error: '404', url: req.url, message: 'Página no encontrada' })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
    }
}

export const isEconomist = async (req, res, next) => {
    try {
        const {info} = req.body
        if(!info.roles == 2 || !info.roles == 1) {
            return res.status(404).render('errors/error', { layout: 'auth', error: '404', url: req.url, message: 'Página no encontrada' })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)  
    }
}
