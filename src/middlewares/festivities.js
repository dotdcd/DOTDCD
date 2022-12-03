export const setFestivities = async (req, res, next) => {
    try {
        const hoy = new Date();
        const month = hoy.getMonth() + 1;
        const day = hoy.getDate();

        if(month == 12 && day < 31){
            res.locals.festivitie = 'navidad'
            next()
        }
        if(month == 12 && day == 31 || month == 1 && day == 1){
            res.locals.festivitie = 'nuevo'
            next()
        }
    } catch (error) {
        console.log(error)
    }
}