import { Router } from "express";
import { sendEmail } from "../controllers/auth/nodemailer.js";
import { addEmployee, uptEmployee, dltEmployee, dltFile, dwnEmployee, dltDoc} from "../controllers/employees/employees.controller.js";
import { addContract, addSignature, aceptContract, declibeContract } from "../controllers/employees/contratos.controller.js";
import { addSignatureT, updSignatureT, dltSignatureT } from "../controllers/signatures/signatures.controller.js";

const employeesRoutes = Router();

employeesRoutes.post('/addEmployee', addEmployee)
employeesRoutes.post('/updEmployee/:id', uptEmployee)
employeesRoutes.delete('/dltEmployee/:id', dltEmployee)
employeesRoutes.delete('/dltFile/:id', dltFile)
employeesRoutes.delete('/dltDoc/:id', dltDoc)
employeesRoutes.delete('/dwnEmployee/:id', dwnEmployee)

//? Contracts
employeesRoutes.post('/addContract', addContract)
employeesRoutes.post('/addSignature', addSignature)
employeesRoutes.put('/aceptContract', aceptContract)
employeesRoutes.put('/declibeContract', declibeContract)
employeesRoutes.post('/addTestify', addSignatureT)
employeesRoutes.put('/updTestify', updSignatureT)
employeesRoutes.delete('/dltTestify/:id', dltSignatureT)

//? Nodemailer
employeesRoutes.get('/sendmail', sendEmail)

export default employeesRoutes;