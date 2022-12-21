import { Router } from 'express';
import {addEmpresa, updateEmpresa, deleteEmpresa } from '../controllers/contabilidad/multiempresas.controller.js';
import {addInversion, deleteInversion, updInversion} from '../controllers/contabilidad/inversion.controller.js';
import {addBanco, deleteBanco, updBanco} from '../controllers/contabilidad/bancos.controller.js';
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



//?add banco
contabilidadRoutes.post('/addCbancaria', addBanco);

//*upd banco
contabilidadRoutes.post('/updCuenta/:id', updBanco);

//!del banco
contabilidadRoutes.delete('/delCuenta/:id', deleteBanco);



/*

//?add proyecto 
 contabilidadRoutes.post('/addProyecto', addProyecto);

//*upd proyecto
contabilidadRoutes.post('/updProyecto/:id', updProyecto);

//!del proyecto
contabilidadRoutes.delete('/delProyecto/:id', deleteProyecto);
*/
export default contabilidadRoutes;