export const renderPrefacturar = async (req, res) => {
    try {
        return res.render('administracion/facturasprefacturas/prefacturar')
    } catch (error) {
        console.log(error)
    }
}
