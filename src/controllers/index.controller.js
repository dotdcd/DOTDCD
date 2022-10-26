const controller = {}
const {pool} = require('../db')

controller.renderIndex = async (req, res) => {
    try {
        const [rows] = await pool.promise().query("SELECT 2 + 2 as num")
        const num = [rows][0][0].num
        console.log(num)
        res.render('index', {num})
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = controller;