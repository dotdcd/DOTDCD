import { Router } from 'express';
const rutasAnalytics = Router();

import { renderOffice } from '../controllers/analytics/analyticsSuc.controller.js';

rutasAnalytics.get('/dashboard/analytics/analytics/:id', renderOffice);

export default rutasAnalytics