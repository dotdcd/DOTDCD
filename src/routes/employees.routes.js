import { Router } from "express";
import { addEmployee, uptEmployee, dltEmployee, dltFile} from "../controllers/employees/employees.controller.js";

const employeesRoutes = Router();

employeesRoutes.post('/addEmployee', addEmployee)
employeesRoutes.post('/updEmployee/:id', uptEmployee)
employeesRoutes.delete('/dltEmployee/:id', dltEmployee)
employeesRoutes.delete('/dltFile/:id', dltFile)

export default employeesRoutes;