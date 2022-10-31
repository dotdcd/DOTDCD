const controller = {}
const {pool} = require('../db')

controller.renderIndex = async (req, res) => {
    try {
        res.render('index', {layout: 'auth'})
    } catch (error) {
        return res.status(500).json(error)
    }
}

controller.renderHome = async (req, res) => {
    res.render('home')
}

module.exports = controller;