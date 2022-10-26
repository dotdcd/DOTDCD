const { Router } = require('express');
const rutas = Router();
const {renderEmployees} = require('../controllers/erp/analytics.controller')

rutas.get('/dashboard/empleados', renderEmployees);

module.exports = rutas;