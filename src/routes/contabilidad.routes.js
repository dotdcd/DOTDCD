import { Router } from 'express';
import {addEmpresa} from '../controllers/contabilidad/multiempresas.controller.js';
import {addInversion} from '../controllers/contabilidad/inversion.controller.js';
const contabilidadRoutes = Router();

//?Add Empresa
contabilidadRoutes.post('/addEmpresa', addEmpresa);


//?add inversion
contabilidadRoutes.post('/addInversion', addInversion);

export default contabilidadRoutes;