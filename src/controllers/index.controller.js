
export const renderIndex = async (req, res) => {
    try {

        res.render('index', {layout: 'auth'})
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const renderHome = async (req, res) => {
    res.render('home')
}
