import { Router } from 'express';
import {addEmpresa, updateEmpresa, deleteEmpresa } from '../controllers/contabilidad/multiempresas.controller.js';
import {addInversion, deleteInversion, updInversion} from '../controllers/contabilidad/inversion.controller.js';
const contabilidadRoutes = Router();

//?Add Empresa
contabilidadRoutes.post('/addEmpresa', addEmpresa);

//*upd Empresa
contabilidadRoutes.post('/updEmpresa/:id', updateEmpresa);

//!del Empresa
contabilidadRoutes.delete('/delEmpresa/:id', deleteEmpresa);

//?add inversion
contabilidadRoutes.post('/addInversion', addInversion);

//*upd inversion
contabilidadRoutes.post('/updInversion/:id', updInversion);

//!del inversion
contabilidadRoutes.delete('/delInversion/:id', deleteInversion);
export default contabilidadRoutes;