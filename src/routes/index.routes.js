// * Requerimor la funcion "Router" para enrutar de express
const { Router } = require('express');
const rutas = Router();
const {renderIndex, renderHome} = require('../controllers/index.controller')
const {login} = require('../controllers/auth/auth.controller')
const {authenticateUser} = require('../middlewares/auth')

rutas.get('/', renderIndex);
rutas.post('/login', login);
rutas.get('/dashboard', authenticateUser, renderHome)

module.exports = rutas;

