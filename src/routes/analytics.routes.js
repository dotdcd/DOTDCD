import { Router } from 'express';
const rutasAnalytics = Router();

import { renderOffice } from '../controllers/analytics/analyticsSuc.controller.js';
import { getProyectos } from '../controllers/erp/analytics.controller.js';

rutasAnalytics.get('/dashboard/analytics/analytics/:id', renderOffice);
rutasAnalytics.get('/pproyectos', getProyectos);

export default rutasAnalytics