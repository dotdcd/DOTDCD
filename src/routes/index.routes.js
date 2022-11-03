// * Requerimos la función "Router" para enrutar de express
import { Router } from 'express';
import { renderIndex, renderHome } from '../controllers/index.controller.js';
import { login, logout } from '../controllers/auth/auth.controller.js';
import {authenticateUser} from '../middlewares/auth.js';

const rutasIndex = Router();

rutasIndex.get('/', renderIndex);
rutasIndex.post('/login', login);
rutasIndex.get('/logout', logout);
rutasIndex.get('/dashboard', authenticateUser, renderHome)

export default rutasIndex;

