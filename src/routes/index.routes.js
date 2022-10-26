// * Requerimor la funcion "Router" para enrutar de express
const { Router } = require('express');
const rutas = Router();
const {renderIndex} = require('../controllers/index.controller')

rutas.get('/', renderIndex);

module.exports = rutas;

