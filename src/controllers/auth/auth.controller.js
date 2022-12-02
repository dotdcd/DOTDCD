import {pool} from '../../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import {SECRET} from '../../config.js'

//? Login controller
export const login = async (req, res) => {
    const { username, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE username = '" + username + "'")
    if (![rows][0].length > 0) {
        req.flash('error', { title: 'Ooops!', message: 'No pudimos encontrar a '+username+'!, intentalo con un nombre de usuario valido.' })
        return res.redirect('/')
    }
    const result = [rows][0][0]

    //? match passwords with bcryptjs
    const matchPass = await bcrypt.compare(password, result.password)
    if (!matchPass) {
        req.flash('error', { title: 'Ooops!', message: 'Lo sentimos '+username+'!, tu contraseña es incorrecta, intentalo de nuevo.' })
        return res.redirect('/')
    }

    //? create json web token
    const token = jwt.sign(
        {
            exp: Math.floor(Date.now() / 100) + 60 * 60 * 24 * 30,
            username,
            id: [rows][0][0].id
        },
        SECRET
    )

    //? create serialize cookie
    const serialized = cookie.serialize('sessionToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        path: "/"
    });   

    //? set cookie in header
    req.app.locals = {username: result.username, profile_img: result.profile_img}
    res.setHeader("Set-Cookie", serialized);
    return res.status(200).redirect('/dashboard')

}

//? logout controller
export const logout = async (req, res) => {
    try {
        //? destroy cookie and jwt 
        const { sessionToken } = req.cookies;
        if (!sessionToken) return res.status(500).json({ error: "Not logged in" })

        const serialized = cookie.serialize('sessionToken', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        res.setHeader("Set-Cookie", serialized);
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

//? register controller

export const addUser = async (req, res) => {
    const {username, password, id_empleado, status} = req.body

    try {

        const nameVer = await pool.query("SELECT * FROM usuarios WHERE username = '" + username + "'")
        if (nameVer[0].length > 0) {
            req.flash('error', { title: 'Usuario Existente!', message: 'Lo sentimos '+username+'!, este nombre de usuario ya esta en uso, intentalo con otro.' })
            return res.redirect('/dashboard/inicio/usuarios')
        }
        

        const salt = await bcrypt.genSalt(10)
    
        await pool.query("INSERT INTO usuarios SET ?", {
            username,
            password: await bcrypt.hash(password, salt),
            id_empleado,
            status
        })

        req.flash('success', { title: 'Bienvenido!', message: 'Se ha registrado correctamente a '+username+', ahora puede iniciar sesion.' })
        return res.redirect('/dashboard/inicio/usuarios')
    } catch (error) {
        req.flash('error', { title: 'Cuenta Existente!', message: 'Lo sentimos!, este empleado ya tiene una cuenta' })
        return res.redirect('/dashboard/inicio/usuarios')
    }
}