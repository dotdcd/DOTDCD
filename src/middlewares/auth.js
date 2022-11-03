import * as jose from 'jose'

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies
        if(!token.sessionToken) {
            req.flash('error', {title: 'Ooops!', message: 'Necesitas iniciar sesión para poder acceder al erp, inicia sesión.'})
            res.redirect('/')
        }

        await jose.jwtVerify(
            token.sessionToken,
            new TextEncoder().encode("secret")
        )
        next()
    } catch (error) {
        console.log(error)
    }
}
